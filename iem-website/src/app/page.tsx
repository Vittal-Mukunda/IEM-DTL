import { siteConfig, siteUrl } from "@/lib/data";
import { jsonLdScript } from "@/lib/jsonLd";
import XrayExperience from "@/components/xray/XrayExperience";

const collegeJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollegeOrUniversity",
  name: "Department of Industrial Engineering and Management, R.V. College of Engineering",
  alternateName: "IEM RVCE",
  url: siteUrl,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mysore Road, R.V. Vidyaniketan Post",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560059",
    addressCountry: "IN",
  },
  sameAs: [
    siteConfig.website,
    siteConfig.socialLinks.facebook,
    siteConfig.socialLinks.linkedin,
    siteConfig.socialLinks.academia,
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(collegeJsonLd) }}
      />
      <XrayExperience />
    </>
  );
}
