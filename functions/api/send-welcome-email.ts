/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple HTML email template for the welcome message.
const createWelcomeEmailHtml = (name: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { font-size: 24px; font-weight: bold; color: #2563EB; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2563EB; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { margin-top: 20px; font-size: 12px; color: #888; }
    </style>
</head>
<body>
    <div class="container">
        <p class="header">Welcome to BankConverts!</p>
        <p>Hi ${name},</p>
        <p>Thank you for registering. We're excited to have you on board. You can now start converting your bank statements with ease and unlock the data within.</p>
        <p>To get started, simply head over to your dashboard:</p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="https://www.bankconverts.com/#dashboard" class="button">Go to Dashboard</a>
        </p>
        <p>If you have any questions, feel free to visit our <a href="https://www.bankconverts.com/#faq">FAQ page</a> or contact support.</p>
        <p>Best regards,<br>The BankConverts Team</p>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} BankConverts.com. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

// This serverless function handles sending a welcome email via the MailChannels API.
// It's designed to be a "fire-and-forget" endpoint; the frontend won't wait for its response.
export const onRequestPost = async ({ request }: { request: Request }) => {
    try {
        const { name, email } = await request.json() as { name?: string, email?: string };

        if (!name || !email) {
            return new Response(JSON.stringify({ error: 'Name and email are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        // Construct the email payload for MailChannels.
        const emailPayload = {
            personalizations: [{ to: [{ email: email, name: name }] }],
            from: { email: "noreply@bankconverts.com", name: "The BankConverts Team" },
            subject: "Welcome to BankConverts!",
            content: [{ type: "text/html", value: createWelcomeEmailHtml(name) }]
        };

        // Send the email using MailChannels API.
        const mailChannelsResponse = await fetch("https://api.mailchannels.net/tx/v1/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload)
        });

        // If the email API call fails, log the error but don't fail the request.
        // The user's registration should not be blocked by an email delivery issue.
        if (!mailChannelsResponse.ok) {
            const errorText = await mailChannelsResponse.text();
            console.error(`MailChannels API Error: ${mailChannelsResponse.status} ${mailChannelsResponse.statusText}`, errorText);
        }

        return new Response(JSON.stringify({ success: true }), { status: 202, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        console.error("Error in send-welcome-email function:", e.message);
        // Return a successful response even on internal error to avoid blocking the client.
        return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), { status: 202, headers: { 'Content-Type': 'application/json' } });
    }
};
