import type { Metadata } from "next";
import LegalPage from "@/components/ui/legal-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 2026"
      sections={[
        {
          heading: "Use of this website",
          body: [
            `This website is operated by the ${siteConfig.name} (${siteConfig.shortName}) to share information about our research, people, and activities. By using it, you agree to these terms.`,
          ],
        },
        {
          heading: "Content & intellectual property",
          body: [
            "Publications, datasets, and other materials are provided for academic and informational purposes. Unless stated otherwise, please cite the original source when using lab resources.",
            "Third-party publications remain the property of their respective publishers.",
          ],
        },
        {
          heading: "Submissions",
          body: [
            "When you submit a form, you confirm that the information is accurate and that you have the right to share any files you upload. Do not submit confidential or sensitive personal information beyond what the form requests.",
          ],
        },
        {
          heading: "Disclaimer",
          body: [
            "Content is provided “as is” without warranties of any kind. ABREL is not liable for decisions made based on information on this website.",
          ],
        },
        {
          heading: "Changes",
          body: ["We may update these terms from time to time. Continued use of the site constitutes acceptance of the revised terms."],
        },
      ]}
    />
  );
}
