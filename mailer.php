<?php
/* =====================================================
   ØRENO — mailer.php
   Shared SMTP transport (SSL/TLS, port 465).
   Included by send-mail.php and send-code.php.
===================================================== */

if (!defined('SMTP_HOST')) {
    require_once __DIR__ . '/config.php';
}

function smtp_send(
    string $to, string $to_name, string $subject, string $html,
    string $reply_email = '', string $reply_name = '',
    string $plaintext = ''
): void {
    $ctx = stream_context_create([
        'ssl' => [
            'verify_peer'       => true,
            'verify_peer_name'  => true,
            'allow_self_signed' => false,
            'SNI_enabled'       => true,
            'peer_name'         => SMTP_HOST,
        ],
    ]);

    $sock = @stream_socket_client(
        'ssl://' . SMTP_HOST . ':' . SMTP_PORT,
        $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx
    );
    if (!$sock) {
        throw new RuntimeException("SMTP connect failed ({$errno}): {$errstr}");
    }
    stream_set_timeout($sock, 15);

    smtp_expect($sock, 220);
    smtp_cmd($sock, 'EHLO ' . (gethostname() ?: 'localhost'), 250);
    smtp_cmd($sock, 'AUTH LOGIN', 334);
    smtp_cmd($sock, base64_encode(SMTP_USER), 334);
    smtp_cmd($sock, base64_encode(SMTP_PASS), 235);
    smtp_cmd($sock, 'MAIL FROM:<' . SMTP_USER . '>', 250);
    smtp_cmd($sock, 'RCPT TO:<' . $to . '>', 250);
    smtp_cmd($sock, 'DATA', 354);

    $enc_from = '=?UTF-8?B?' . base64_encode(SMTP_FROM) . '?=';
    $enc_to   = '=?UTF-8?B?' . base64_encode($to_name)  . '?=';
    $enc_subj = '=?UTF-8?B?' . base64_encode($subject)  . '?=';

    /* Auto-derive plaintext from HTML if caller didn't supply one.
       A plaintext alternative is one of the strongest anti-spam signals. */
    if ($plaintext === '') {
        $plaintext = html_to_plaintext($html);
    }

    $msg  = "From: {$enc_from} <" . SMTP_USER . ">\r\n";
    $msg .= "To: {$enc_to} <{$to}>\r\n";
    if ($reply_email) {
        $enc_reply = '=?UTF-8?B?' . base64_encode($reply_name) . '?=';
        $msg .= "Reply-To: {$enc_reply} <{$reply_email}>\r\n";
    }
    $msg .= "Subject: {$enc_subj}\r\n";
    $msg .= "Date: " . date('r') . "\r\n";
    $msg .= "Message-ID: <" . bin2hex(random_bytes(12)) . "." . time() . "@oreno.lk>\r\n";
    $msg .= "MIME-Version: 1.0\r\n";
    $msg .= "Auto-Submitted: auto-generated\r\n";
    $msg .= "X-Mailer: ORENO-Studio-Mailer/1.0\r\n";

    $boundary = 'ORENO_' . bin2hex(random_bytes(12));
    $msg .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
    $msg .= "\r\n";
    $msg .= "This is a multi-part message in MIME format.\r\n";

    /* Plaintext part */
    $msg .= "--{$boundary}\r\n";
    $msg .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $msg .= "Content-Transfer-Encoding: base64\r\n";
    $msg .= "\r\n";
    $msg .= chunk_split(base64_encode($plaintext));
    $msg .= "\r\n";

    /* HTML part */
    $msg .= "--{$boundary}\r\n";
    $msg .= "Content-Type: text/html; charset=UTF-8\r\n";
    $msg .= "Content-Transfer-Encoding: base64\r\n";
    $msg .= "\r\n";
    $msg .= chunk_split(base64_encode($html));
    $msg .= "\r\n";

    $msg .= "--{$boundary}--\r\n";
    $msg .= ".";

    fwrite($sock, $msg . "\r\n");
    smtp_expect($sock, 250);
    smtp_cmd($sock, 'QUIT', 221);
    fclose($sock);
}

function smtp_cmd($sock, string $cmd, int $expect): string {
    fwrite($sock, $cmd . "\r\n");
    return smtp_expect($sock, $expect);
}

function html_to_plaintext(string $html): string {
    $t = preg_replace('/<br\s*\/?>/i', "\n", $html);
    $t = preg_replace('/<\/(p|div|h[1-6]|tr|li)>/i', "\n", $t);
    $t = preg_replace('/<li[^>]*>/i', '  • ', $t);
    $t = strip_tags($t);
    $t = html_entity_decode($t, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $t = preg_replace("/[ \t]+/", ' ', $t);
    $t = preg_replace("/\n[ \t]+/", "\n", $t);
    $t = preg_replace("/\n{3,}/", "\n\n", $t);
    return trim($t);
}

function smtp_expect($sock, int $expected): string {
    $data = '';
    while ($line = fgets($sock, 512)) {
        $data .= $line;
        if (substr($line, 3, 1) === ' ') break;
    }
    $code = (int) substr($data, 0, 3);
    if ($code !== $expected) {
        throw new RuntimeException("SMTP expected {$expected}, got {$code}: " . trim($data));
    }
    return $data;
}
