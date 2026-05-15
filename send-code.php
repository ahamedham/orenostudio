<?php
/* =====================================================
   ØRENO — send-code.php
   Email-verification endpoint.
   action=send    → email a 6-digit code to the user
   action=verify  → check the code, return an HMAC token
===================================================== */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/mailer.php';

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: https://oreno.lk');
header('Access-Control-Allow-Methods: POST');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

/* ── Origin / Referer check ── */
$allowed_origins = ['https://oreno.lk', 'https://www.oreno.lk'];
$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$origin_ok = $origin && in_array($origin, $allowed_origins, true);
if (!$origin_ok && $referer) {
    foreach ($allowed_origins as $a) {
        if (str_starts_with($referer, $a . '/') || $referer === $a) { $origin_ok = true; break; }
    }
}
if (!$origin_ok) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Request origin not allowed']);
    exit;
}

$action = (string)($_POST['action'] ?? '');
$email  = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_SANITIZE_EMAIL);
if (strlen($email) > 254) $email = substr($email, 0, 254);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email)) {
    echo json_encode(['ok' => false, 'error' => 'Please enter a valid email address']);
    exit;
}
$email_key = hash('sha256', strtolower($email));
$ip        = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

$store_file = __DIR__ . '/verify-codes.json';
$store      = read_store($store_file);
$now        = time();
prune_store($store, $now);

if ($action === 'send') {
    /* Rate limit: 3 send requests per email per hour, 5 per IP per hour */
    $email_sends = count_sends($store, 'email', $email_key, $now, 3600);
    $ip_sends    = count_sends($store, 'ip', $ip,         $now, 3600);
    if ($email_sends >= 3) {
        echo json_encode(['ok' => false, 'error' => 'Too many codes sent for this email. Try again in an hour.']);
        exit;
    }
    if ($ip_sends >= 5) {
        echo json_encode(['ok' => false, 'error' => 'Too many verification requests. Try again in an hour.']);
        exit;
    }

    /* Generate 6-digit code, store hashed */
    $code      = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $code_hash = password_hash($code, PASSWORD_DEFAULT);

    $store['codes'][$email_key] = [
        'code_hash' => $code_hash,
        'created'   => $now,
        'expires'   => $now + 600,   // 10 min
        'attempts'  => 0,
        'ip'        => $ip,
    ];
    $store['sends'][] = ['email' => $email_key, 'ip' => $ip, 't' => $now];
    write_store($store_file, $store);

    try {
        $plaintext =
            "ØRENO Studio\n" .
            "=====================\n\n" .
            "Your verification code:\n\n" .
            "    " . $code . "\n\n" .
            "Enter this code on oreno.lk to confirm your email.\n" .
            "It expires in 10 minutes.\n\n" .
            "If you didn't request this, you can safely ignore this message.\n\n" .
            "—\n" .
            "ØRENO Studio · Colombo, Sri Lanka\n" .
            "contact@oreno.lk · https://oreno.lk\n";

        smtp_send(
            $email, 'Verify your email',
            'Your ØRENO verification code',
            email_code_html($code),
            MAIL_TO, 'ØRENO Studio',
            $plaintext
        );
        echo json_encode(['ok' => true]);
    } catch (RuntimeException $e) {
        error_log('[ØRENO verify] ' . $e->getMessage());
        echo json_encode(['ok' => false, 'error' => 'Could not send code. Try again or use WhatsApp.']);
    }
    exit;
}

if ($action === 'verify') {
    $code = preg_replace('/\D/', '', (string)($_POST['code'] ?? ''));
    if (strlen($code) !== 6) {
        echo json_encode(['ok' => false, 'error' => 'Enter the 6-digit code']);
        exit;
    }
    $entry = $store['codes'][$email_key] ?? null;
    if (!$entry || $entry['expires'] < $now) {
        echo json_encode(['ok' => false, 'error' => 'Code expired — request a new one']);
        exit;
    }
    if (($entry['attempts'] ?? 0) >= 5) {
        unset($store['codes'][$email_key]);
        write_store($store_file, $store);
        echo json_encode(['ok' => false, 'error' => 'Too many wrong attempts — request a new code']);
        exit;
    }
    if (!password_verify($code, $entry['code_hash'])) {
        $store['codes'][$email_key]['attempts'] = ($entry['attempts'] ?? 0) + 1;
        write_store($store_file, $store);
        echo json_encode(['ok' => false, 'error' => 'Incorrect code']);
        exit;
    }

    /* Valid — consume code, mint token (valid 15 min for final submit) */
    unset($store['codes'][$email_key]);
    write_store($store_file, $store);

    $expires = $now + 900;
    $sig     = hash_hmac('sha256', strtolower($email) . '|' . $expires, VERIFY_SECRET);
    $token   = strtolower($email) . '|' . $expires . '|' . $sig;
    echo json_encode(['ok' => true, 'token' => $token]);
    exit;
}

echo json_encode(['ok' => false, 'error' => 'Unknown action']);
exit;

/* ── Storage helpers ── */
function read_store(string $file): array {
    if (!is_file($file)) return ['codes' => [], 'sends' => []];
    $raw = @file_get_contents($file);
    $d   = $raw ? json_decode($raw, true) : null;
    if (!is_array($d)) return ['codes' => [], 'sends' => []];
    $d['codes'] = $d['codes'] ?? [];
    $d['sends'] = $d['sends'] ?? [];
    return $d;
}

function write_store(string $file, array $data): void {
    @file_put_contents($file, json_encode($data), LOCK_EX);
}

function prune_store(array &$store, int $now): void {
    foreach ($store['codes'] as $k => $v) {
        if (($v['expires'] ?? 0) < $now) unset($store['codes'][$k]);
    }
    $store['sends'] = array_values(array_filter(
        $store['sends'],
        fn($s) => ($now - ($s['t'] ?? 0)) < 3600
    ));
}

function count_sends(array $store, string $field, string $value, int $now, int $window): int {
    $n = 0;
    foreach ($store['sends'] as $s) {
        if (($s[$field] ?? '') === $value && ($now - ($s['t'] ?? 0)) < $window) $n++;
    }
    return $n;
}

/* ── Email template ── */
function email_code_html(string $code): string {
    $digits = '';
    for ($i = 0; $i < 6; $i++) {
        $digits .= "<span style='display:inline-block;width:44px;height:54px;line-height:54px;margin:0 4px;background:#0f0f0f;border:1px solid rgba(212,160,23,0.35);border-radius:4px;font-family:\"SF Mono\",Menlo,Consolas,monospace;font-size:26px;color:#d4a017;letter-spacing:0;'>" . $code[$i] . "</span>";
    }
    return <<<HTML
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;">
<tr><td align="center" style="padding:40px 20px;">
  <table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;background:#111;border:1px solid rgba(255,255,255,0.09);border-radius:3px;">
    <tr><td style="padding:26px 36px;border-bottom:1px solid rgba(255,255,255,0.07);">
      <span style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(245,243,238,0.4);font-family:monospace;">ØRENO STUDIO</span>
    </td></tr>
    <tr><td style="padding:36px 36px 12px;text-align:center;">
      <h2 style="margin:0 0 14px;font-size:20px;font-weight:400;color:rgba(245,243,238,0.92);letter-spacing:-0.3px;">Verify your email</h2>
      <p style="margin:0 0 28px;font-size:13px;line-height:1.7;color:rgba(245,243,238,0.55);">Enter this code in the form to confirm we can reach you.<br>It expires in 10 minutes.</p>
      <div style="margin:0 0 28px;">{$digits}</div>
      <p style="margin:0;font-size:11px;color:rgba(245,243,238,0.35);font-family:monospace;">Didn't request this? Ignore this email.</p>
    </td></tr>
    <tr><td style="padding:18px 36px;border-top:1px solid rgba(255,255,255,0.07);">
      <span style="font-size:11px;color:rgba(245,243,238,0.28);font-family:monospace;">contact@oreno.lk &nbsp;·&nbsp; oreno.lk &nbsp;·&nbsp; Colombo, Sri Lanka</span>
    </td></tr>
  </table>
</td></tr></table></body></html>
HTML;
}
