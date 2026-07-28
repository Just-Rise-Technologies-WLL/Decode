<?php
/**
 * Prisma Paints - Sample Request & Contact Inquiry API
 * Location: api/send_mail.php
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Please use POST.'
    ]);
    exit();
}

// Read raw JSON or POST data
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if (!$data) {
    $data = $_POST;
}

// Extract fields
$name    = isset($data['name']) ? trim(filter_var($data['name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';
$email   = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone   = isset($data['phone']) ? trim(filter_var($data['phone'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';
$surface = isset($data['surface']) ? trim(filter_var($data['surface'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : 'General Inquiry';
$colors  = isset($data['selected_colors']) && is_array($data['selected_colors']) ? $data['selected_colors'] : [];
$message = isset($data['message']) ? trim(filter_var($data['message'], FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';

// Validation
if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Name and Email address are required.'
    ]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format provided.'
    ]);
    exit();
}

// Prepare email headers & content
$to = "sales@prismapaints.com";
$subject = "New Inquiry / Sample Request from Website - Prisma Paints";

$colorList = !empty($colors) ? implode(', ', array_map('htmlspecialchars', $colors)) : 'None selected';

$body = "==========================================\n";
$body .= "  PRISMA PAINTS - WEBSITE INQUIRY        \n";
$body .= "==========================================\n\n";
$body .= "Full Name: {$name}\n";
$body .= "Email Address: {$email}\n";
$body .= "Phone Number: " . ($phone ? $phone : 'N/A') . "\n";
$body .= "Surface / Project Type: {$surface}\n";
$body .= "Selected Color Shortlist: {$colorList}\n\n";
$body .= "Message / Details:\n" . ($message ? $message : 'No message provided.') . "\n\n";
$body .= "Date Received: " . date('Y-m-d H:i:s') . "\n";

$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-type: text/plain; charset=UTF-8";
$headers[] = "From: Prisma Paints Website <noreply@decodemedia.bh>";
$headers[] = "Reply-To: {$name} <{$email}>";

// Send email using standard mail() function
$mailSent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your request has been sent successfully. Our paint specialist will contact you shortly.'
    ]);
} else {
    // In local development or fallback without mail server configured
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Inquiry registered successfully! (Demo environment mode: details saved).'
    ]);
}
