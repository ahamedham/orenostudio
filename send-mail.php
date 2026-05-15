<?php
/* =====================================================
   ØRENO — send-mail.php
   Unified email handler: contact | inquiry | proposal
   No external dependencies — pure PHP SMTP over SSL.
===================================================== */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mailer.php';

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: https://oreno.lk');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

/* ── Only accept POST ── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

/* ── Origin / Referer check — defence against off-site form submissions ── */
$allowed_origins = ['https://oreno.lk', 'https://www.oreno.lk'];
$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$origin_ok = false;
if ($origin && in_array($origin, $allowed_origins, true)) {
    $origin_ok = true;
} elseif ($referer) {
    foreach ($allowed_origins as $a) {
        if (str_starts_with($referer, $a . '/') || $referer === $a) { $origin_ok = true; break; }
    }
}
if (!$origin_ok) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Request origin not allowed']);
    exit;
}

/* ── Honeypot: if bots fill the hidden "website" field, silently succeed ── */
if (!empty($_POST['website']) || !empty($_POST['hp_url'])) {
    echo json_encode(['ok' => true]);
    exit;
}

/* ── Request body size guard (defence-in-depth on top of post_max_size) ── */
$raw_len = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($raw_len > 20000) { // 20 KB hard cap for contact/inquiry/proposal forms
    http_response_code(413);
    echo json_encode(['ok' => false, 'error' => 'Payload too large']);
    exit;
}

/* ── Per-IP rate limit: max 5 submissions per 10 minutes ── */
(function () {
    $ip   = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $file = __DIR__ . '/rate-limit.json';
    $now  = time();
    $win  = 600;   // 10 minutes
    $max  = 5;
    $data = [];
    if (is_file($file)) {
        $raw = @file_get_contents($file);
        if ($raw) { $tmp = json_decode($raw, true); if (is_array($tmp)) $data = $tmp; }
    }
    // prune
    foreach ($data as $k => $arr) {
        $data[$k] = array_values(array_filter($arr, fn($t) => ($now - $t) < $win));
        if (!$data[$k]) unset($data[$k]);
    }
    $data[$ip] = $data[$ip] ?? [];
    if (count($data[$ip]) >= $max) {
        http_response_code(429);
        header('Retry-After: ' . $win);
        echo json_encode(['ok' => false, 'error' => 'Too many requests. Please try again later or use WhatsApp.']);
        exit;
    }
    $data[$ip][] = $now;
    @file_put_contents($file, json_encode($data), LOCK_EX);
})();

/* ── Sanitize helpers ── */
function clean(string $v, int $max = 2000): string {
    $v = htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    if (strlen($v) > $max) $v = substr($v, 0, $max);
    return $v;
}
function require_field(string $v, string $label): void {
    if ($v === '') {
        echo json_encode(['ok' => false, 'error' => $label . ' is required']);
        exit;
    }
}

/* ── Read common fields (with length caps) ── */
$type  = clean($_POST['type']  ?? '', 32);
$name  = clean($_POST['name']  ?? '', 120);
$email = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_SANITIZE_EMAIL);
if (strlen($email) > 254) $email = substr($email, 0, 254);

require_field($name,  'Name');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['ok' => false, 'error' => 'Please enter a valid email address']);
    exit;
}

/* ── Header-injection guard on email (CRLF) ── */
if (preg_match('/[\r\n]/', $email) || preg_match('/[\r\n]/', $name)) {
    echo json_encode(['ok' => false, 'error' => 'Invalid characters detected']);
    exit;
}

/* ── Verify email-verification token ── */
$verify_token = (string)($_POST['verify_token'] ?? '');
$token_parts  = explode('|', $verify_token, 3);
if (count($token_parts) !== 3) {
    echo json_encode(['ok' => false, 'error' => 'Email not verified']);
    exit;
}
[$tok_email, $tok_expires, $tok_sig] = $token_parts;
$expected_sig = hash_hmac('sha256', strtolower($tok_email) . '|' . $tok_expires, VERIFY_SECRET);
if (!hash_equals($expected_sig, $tok_sig)) {
    echo json_encode(['ok' => false, 'error' => 'Invalid verification token']);
    exit;
}
if ((int)$tok_expires < time()) {
    echo json_encode(['ok' => false, 'error' => 'Verification expired — please verify again']);
    exit;
}
if (strcasecmp($tok_email, $email) !== 0) {
    echo json_encode(['ok' => false, 'error' => 'Email does not match verification']);
    exit;
}

/* ── Build email body per type ── */
switch ($type) {

    case 'contact':
        $msg = clean($_POST['message'] ?? '', 5000);
        require_field($msg, 'Message');
        $subject = 'New Message — ' . $name;
        $html    = email_contact($name, $email, $msg);
        break;

    case 'inquiry':
        $vision   = clean($_POST['vision']   ?? '', 5000);
        $timeline = clean($_POST['timeline'] ?? '', 120);
        $budget   = clean($_POST['budget']   ?? '', 120);
        require_field($vision, 'Vision');
        $subject = 'New Project Inquiry — ' . $name;
        $html    = email_inquiry($name, $email, $vision, $timeline, $budget);
        break;

    case 'proposal':
        $package = clean($_POST['package'] ?? '', 120);
        $addons  = clean($_POST['addons']  ?? '', 2000);
        $total   = clean($_POST['total']   ?? '', 60);
        $body    = clean($_POST['body']    ?? '', 5000);
        require_field($package, 'Package');
        $subject = 'Package Enquiry — ' . $name . ' via oreno.lk/packages';
        $html    = email_proposal($name, $email, $package, $addons, $total, $body);
        break;

    default:
        echo json_encode(['ok' => false, 'error' => 'Unknown form type']);
        exit;
}

/* ── Send ── */
try {
    smtp_send(MAIL_TO, 'ØRENO Studio', $subject, $html, $email, $name);
    echo json_encode(['ok' => true]);
} catch (RuntimeException $e) {
    error_log('[ØRENO mailer] ' . $e->getMessage());
    echo json_encode(['ok' => false, 'error' => 'Message could not be delivered. Please try WhatsApp.']);
}
exit;

/* ════════════════════════════════════════════════════
   Email HTML templates
════════════════════════════════════════════════════ */

function email_wrap(string $content): string {
    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;">
<tr><td align="center" style="padding:40px 20px;">
  <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background:#111;border:1px solid rgba(255,255,255,0.09);border-radius:3px;">

    <!-- Header -->
    <tr><td style="padding:26px 36px;border-bottom:1px solid rgba(255,255,255,0.07);">
      <span style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(245,243,238,0.4);font-family:monospace;">ØRENO STUDIO</span>
    </td></tr>

    <!-- Body -->
    <tr><td style="padding:36px 36px 32px;">{$content}</td></tr>

    <!-- Footer -->
    <tr><td style="padding:18px 36px;border-top:1px solid rgba(255,255,255,0.07);">
      <span style="font-size:11px;color:rgba(245,243,238,0.28);font-family:monospace;">contact@oreno.lk &nbsp;·&nbsp; oreno.lk &nbsp;·&nbsp; Colombo, Sri Lanka</span>
    </td></tr>

  </table>
</td></tr>
</table>
</body></html>
HTML;
}

function field_row(string $label, string $value): string {
    return "
    <tr>
      <td style='padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(245,243,238,0.38);font-size:10px;letter-spacing:0.14em;text-transform:uppercase;font-family:monospace;width:120px;vertical-align:top;white-space:nowrap;'>{$label}</td>
      <td style='padding:11px 0 11px 22px;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(245,243,238,0.88);font-size:14px;line-height:1.65;vertical-align:top;'>{$value}</td>
    </tr>";
}

function email_contact(string $name, string $email, string $message): string {
    $content = "
    <h2 style='margin:0 0 26px;font-size:20px;font-weight:400;color:rgba(245,243,238,0.92);letter-spacing:-0.3px;'>New Message</h2>
    <table width='100%' cellpadding='0' cellspacing='0' border='0'>
      " . field_row('Name',    esc($name))    . "
      " . field_row('Email',   "<a href='mailto:{$email}' style='color:#b8860b;text-decoration:none;'>{$email}</a>") . "
      " . field_row('Message', nl2br(esc($message))) . "
    </table>";
    return email_wrap($content);
}

function email_inquiry(string $name, string $email, string $vision, string $timeline, string $budget): string {
    $content = "
    <h2 style='margin:0 0 26px;font-size:20px;font-weight:400;color:rgba(245,243,238,0.92);letter-spacing:-0.3px;'>New Project Inquiry</h2>
    <table width='100%' cellpadding='0' cellspacing='0' border='0'>
      " . field_row('Name',     esc($name))     . "
      " . field_row('Email',    "<a href='mailto:{$email}' style='color:#b8860b;text-decoration:none;'>{$email}</a>") . "
      " . field_row('Vision',   nl2br(esc($vision)))   . "
      " . field_row('Timeline', esc($timeline)) . "
      " . field_row('Budget',   esc($budget))   . "
    </table>";
    return email_wrap($content);
}

function email_proposal(string $name, string $email, string $package, string $addons, string $total, string $body): string {
    $addon_html = $addons ? nl2br(esc($addons)) : '<span style="color:rgba(245,243,238,0.35);">None selected</span>';
    $content = "
    <h2 style='margin:0 0 26px;font-size:20px;font-weight:400;color:rgba(245,243,238,0.92);letter-spacing:-0.3px;'>Package Enquiry</h2>
    <table width='100%' cellpadding='0' cellspacing='0' border='0'>
      " . field_row('From',      esc($name))  . "
      " . field_row('Email',     "<a href='mailto:{$email}' style='color:#b8860b;text-decoration:none;'>{$email}</a>") . "
      " . field_row('Package',   esc($package)) . "
      " . field_row('Add-ons',   $addon_html) . "
      " . field_row('Est. Total', esc($total)) . "
      " . field_row('Message',   $body ? nl2br(esc($body)) : '<span style="color:rgba(245,243,238,0.35);">No message</span>') . "
    </table>
    <p style='margin:26px 0 0;font-size:12px;color:rgba(245,243,238,0.35);font-family:monospace;'>Sent via oreno.lk/packages</p>";
    return email_wrap($content);
}

function esc(string $v): string {
    return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
