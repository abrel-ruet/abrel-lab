import type { Metadata } from "next";
import LegalPage from "@/components/ui/legal-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 2026"
      sections={[
        {
          heading: "Information we collect",
          body: [
            `${siteConfig.name} (${siteConfig.shortName}) collects only the information you choose to submit through this website: contact form messages, newsletter sign-ups, and research position applications (including any CV you attach).`,
            "We use Google Firebase Analytics to understand aggregate site usage, such as pages visited and device types.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "Submitted information is used solely to respond to your inquiry, send lab newsletters you subscribed to, and evaluate recruitment applications.",
            "We do not sell or share your personal information with third parties for marketing purposes.",
          ],
        },
        {
          heading: "Storage & security",
          body: [
            "Form submissions are stored in Google Firebase (Cloud Firestore). Uploaded files are stored with Cloudinary. Access to submissions is restricted to authorized lab administrators.",
          ],
        },
        {
          heading: "Your choices",
          body: [
            `You may request access to, correction of, or deletion of your data — or unsubscribe from the newsletter — at any time by emailing ${siteConfig.email}.`,
          ],
        },
        {
          heading: "Contact",
          body: [`Questions about this policy can be sent to ${siteConfig.email}.`],
        },
      ]}
    />
  );
}
