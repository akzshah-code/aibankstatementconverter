/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// HTML email template for the plan upgrade confirmation.
const createUpgradeEmailHtml = (name: string, planName: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { font-size: 24px; font-weight: bold; color: #10B981; }
        .plan-box { background-color: #F3F4F6; border: 1px solid #E5E7EB; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
        .plan-name { font-size: 20px; font-weight: bold; color: #111827; }
        .footer { margin-top: 20px; font-size: 12px; color: #888; }
    </style>
</head>
<body>
    <div class="container">
        <p class="header">Upgrade Successful!</p>
        <p>Hi ${name},</p>
        <p>Your subscription has been successfully upgraded. Your account is now on the <strong>${planName}</strong> plan.</p>
        <div class="plan-box">
            <p style="margin: 0; color: #6B7280;">Your New Plan:</p>
            <p class="plan-name">${planName}</p>
        </div>
        <p>Thank you for your business. You can view your new plan details and usage limits in your dashboard.</p>
        <p>Best regards,<br>The BankConverts Team</p>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} BankConverts.com. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

// This serverless function handles sending a plan upgrade email via MailChannels.
export const onRequestPost = async ({ request }: { request: Request }) => {
    try {
        const { name, email, planName } = await request.json() as { name?: string, email?: string, planName?: string };

        if (!name || !email || !planName) {
            return new Response(JSON.stringify({ error: 'Name, email, and planName are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        const emailPayload = {
            personalizations: [{ to: [{ email: email, name: name }] }],
            from: { email: "noreply@bankconverts.com", name: "The BankConverts Team" },
            subject: `Your BankConverts Plan Has Been Upgraded to ${planName}`,
            content: [{ type: "text/html", value: createUpgradeEmailHtml(name, planName) }]
        };

        const mailChannelsResponse = await fetch("https://api.mailchannels.net/tx/v1/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload)
        });
        
        if (!mailChannelsResponse.ok) {
            const errorText = await mailChannelsResponse.text();
            console.error(`MailChannels API Error: ${mailChannelsResponse.status} ${mailChannelsResponse.statusText}`, errorText);
        }

        return new Response(JSON.stringify({ success: true }), { status: 202, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        console.error("Error in send-upgrade-email function:", e.message);
        return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), { status: 202, headers: { 'Content-Type': 'application/json' } });
    }
};
