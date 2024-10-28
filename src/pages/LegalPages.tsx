import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';

const legalContent = {
  terms: {
    title: 'Terms of Service',
    content: `
# Terms of Service Agreement

**Last Updated: ${new Date().toLocaleDateString()}**

This Terms of Service Agreement ("Agreement") is entered into by and between PawfectFind ("we," "us," "our") and you ("you," "your," "user"). By accessing or using our website and services, you agree to be bound by these terms.

## 1. Acceptance of Terms

By accessing or using PawfectFind, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not access or use our services.

## 2. Service Description

PawfectFind is a pet product discovery platform that provides:
- Personalized product recommendations
- Product comparisons and reviews
- Price tracking and alerts
- Community features and discussions
- Pet profile management

## 3. User Accounts and Registration

### 3.1 Account Creation
- You must provide accurate and complete information
- You are responsible for maintaining account security
- You must notify us of any unauthorized access

### 3.2 Account Termination
We reserve the right to terminate or suspend accounts that:
- Violate these terms
- Engage in fraudulent activity
- Abuse our services

## 4. Intellectual Property Rights

### 4.1 Our Content
- All content, features, and functionality are owned by PawfectFind
- Content is protected by copyright, trademark, and other laws
- Unauthorized use is prohibited

### 4.2 User Content
- You retain ownership of your content
- You grant us a license to use your content
- You are responsible for your content

## 5. Product Information and Pricing

### 5.1 Accuracy
- We strive to provide accurate product information
- Prices and availability may change
- We are not responsible for merchant errors

### 5.2 Third-Party Products
- Products are sold by third-party merchants
- We do not warrant third-party products
- Transactions are between you and the merchant

## 6. Affiliate Relationships

### 6.1 Disclosure
- We participate in affiliate programs
- We may earn commissions from purchases
- Commissions do not affect recommendations

### 6.2 Third-Party Links
- We provide links to other websites
- We are not responsible for third-party content
- Your use of third-party sites is at your own risk

## 7. Limitation of Liability

### 7.1 Disclaimer
TO THE MAXIMUM EXTENT PERMITTED BY LAW, PAWFECTFIND AND ITS AFFILIATES SHALL NOT BE LIABLE FOR:
- Direct, indirect, or consequential damages
- Loss of profits or data
- Business interruption
- Any other damages arising from use of our services

### 7.2 Warranty Disclaimer
THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND

## 8. Indemnification

You agree to indemnify and hold harmless PawfectFind and its affiliates from any claims arising from:
- Your use of the service
- Your violation of these terms
- Your violation of any rights of another

## 9. Changes to Terms

### 9.1 Modifications
- We may modify these terms at any time
- Changes will be effective immediately upon posting
- Your continued use constitutes acceptance

### 9.2 Notification
- We will notify users of material changes
- Notification may be via email or service announcement

## 10. Governing Law

### 10.1 Jurisdiction
- These terms are governed by United States law
- You agree to jurisdiction in United States courts

### 10.2 Dispute Resolution
- Disputes will be resolved through arbitration
- Class action waiver applies

## 11. Contact Information

For questions about these Terms:
- Email: legal@pawfectfind.com
- Address: [Business Address]

## 12. Severability

If any provision is found unenforceable:
- The provision will be modified
- Remaining provisions stay in effect

By using PawfectFind, you acknowledge that you have read, understood, and agree to be bound by this Agreement.
    `
  },
  privacy: {
    title: 'Privacy Policy',
    content: `
# Privacy Policy

**Last Updated: ${new Date().toLocaleDateString()}**

## 1. Introduction

PawfectFind ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.

## 2. Information We Collect

### 2.1 Personal Information
- Name and contact information
- Account credentials
- Payment information
- Pet profiles and preferences
- Communication history

### 2.2 Usage Data
- Browser and device information
- IP address and location data
- Interaction with our services
- Cookies and tracking technologies

## 3. How We Use Your Information

### 3.1 Primary Uses
- Provide personalized recommendations
- Process transactions
- Improve our services
- Communicate with you
- Analyze usage patterns

### 3.2 Legal Basis
We process your information based on:
- Contract performance
- Legal obligations
- Legitimate interests
- Your consent

## 4. Information Sharing

### 4.1 Third-Party Service Providers
We may share information with:
- Payment processors
- Analytics providers
- Marketing services
- Cloud storage providers

### 4.2 Legal Requirements
We may disclose information:
- To comply with laws
- To protect rights
- To prevent fraud

## 5. Data Security

### 5.1 Protection Measures
- Encryption protocols
- Access controls
- Regular security audits
- Employee training

### 5.2 Data Retention
- We retain data as needed
- You can request deletion
- Some data may be retained for legal purposes

## 6. Your Rights

### 6.1 Access Rights
You have the right to:
- Access your data
- Correct inaccuracies
- Request deletion
- Object to processing
- Data portability

### 6.2 Exercise Your Rights
To exercise these rights:
- Contact our privacy team
- Verify your identity
- Specify your request

## 7. Children's Privacy

- We do not knowingly collect data from children under 13
- Parents can request data deletion
- We comply with COPPA

## 8. International Data Transfers

### 8.1 Data Location
- Data may be transferred internationally
- We use appropriate safeguards
- We comply with data transfer regulations

### 8.2 Protection Measures
- Standard contractual clauses
- Privacy Shield compliance
- Adequate protection measures

## 9. Cookies and Tracking

### 9.1 Cookie Usage
We use cookies for:
- Essential functionality
- Performance monitoring
- User preferences
- Marketing purposes

### 9.2 Cookie Control
You can:
- Accept or reject cookies
- Modify browser settings
- Delete existing cookies

## 10. Marketing Communications

### 10.1 Email Marketing
- We send promotional emails
- You can opt-out anytime
- We honor preferences

### 10.2 Targeted Advertising
- We use behavioral data
- You can opt-out
- Third-party networks involved

## 11. Changes to Privacy Policy

### 11.1 Updates
- We may update this policy
- Changes effective upon posting
- Material changes notified

### 11.2 Notification
- Email notification for major changes
- 30-day notice when possible
- Continued use implies acceptance

## 12. Contact Us

For privacy concerns:
- Email: privacy@pawfectfind.com
- Address: [Business Address]
- Phone: [Phone Number]

## 13. Additional Rights

### 13.1 California Residents
Under CCPA:
- Right to know
- Right to delete
- Right to opt-out
- Non-discrimination

### 13.2 European Residents
Under GDPR:
- Additional rights
- Data protection officer
- Supervisory authority complaints

This Privacy Policy is effective as of the Last Updated date above.
    `
  },
  disclaimer: {
    title: 'Legal Disclaimer',
    content: `
# Legal Disclaimer

**Last Updated: ${new Date().toLocaleDateString()}**

## 1. General Disclaimer

### 1.1 Information Accuracy
PawfectFind ("we," "us," "our") provides this website and its contents on an "AS IS" basis. While we make every effort to ensure the accuracy of our content, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website.

### 1.2 Use at Your Own Risk
Any reliance you place on such information is strictly at your own risk. We shall not be liable for any loss or damage, including without limitation, indirect or consequential loss or damage, arising from the use of this website.

## 2. Product Information

### 2.1 Product Accuracy
- Product information is provided by manufacturers and sellers
- Specifications may change without notice
- Images are representative only
- Actual products may vary

### 2.2 Pricing and Availability
- Prices are subject to change
- Availability cannot be guaranteed
- Deals and promotions may be time-limited
- Regional restrictions may apply

## 3. Professional Advice

### 3.1 Not Veterinary Advice
- Content is for informational purposes only
- Not a substitute for professional veterinary advice
- Consult qualified professionals for specific pet health issues
- Emergency situations require immediate veterinary attention

### 3.2 Pet Care Decisions
- Each pet is unique
- Results may vary
- Consider individual pet needs
- Consult professionals when necessary

## 4. Affiliate Relationships

### 4.1 Compensation Disclosure
- We participate in affiliate programs
- We earn from qualifying purchases
- Commissions do not affect recommendations
- All relationships are disclosed

### 4.2 Third-Party Content
- Links to external websites provided
- No control over third-party content
- Not responsible for external websites
- Use third-party services at your own risk

## 5. Intellectual Property

### 5.1 Copyright
- All content is protected
- Unauthorized use prohibited
- Reproduction requires permission
- Trademarks acknowledged

### 5.2 User Content
- Users retain their rights
- License granted to us
- We may remove content
- No guarantee of confidentiality

## 6. Limitation of Liability

### 6.1 Damages
TO THE FULLEST EXTENT PERMITTED BY LAW, PAWFECTFIND SHALL NOT BE LIABLE FOR:
- Direct damages
- Indirect damages
- Consequential damages
- Special damages
- Punitive damages
- Lost profits
- Lost data
- Business interruption

### 6.2 Maximum Liability
If liability cannot be excluded:
- Limited to service fees paid
- Or $100, whichever is less
- Exclusive remedy
- Time-limited claims

## 7. Indemnification

You agree to indemnify and hold harmless PawfectFind from:
- Claims
- Damages
- Losses
- Costs
- Liabilities
- Legal fees

## 8. Changes to Disclaimer

### 8.1 Updates
- We may update this disclaimer
- Changes effective immediately
- Continued use implies acceptance
- Review regularly

### 8.2 Notification
- Material changes notified
- Email notification when possible
- Posted on website
- Prior versions archived

## 9. Governing Law

### 9.1 Jurisdiction
- United States law applies
- Exclusive jurisdiction
- Venue selection
- Choice of law

### 9.2 Severability
- Invalid provisions severable
- Remaining terms enforceable
- Good faith modification
- Intent preserved

## 10. Contact Information

For legal inquiries:
- Email: legal@pawfectfind.com
- Address: [Business Address]
- Phone: [Phone Number]

This disclaimer is effective as of the Last Updated date above.
    `
  },
  'affiliate-disclosure': {
    title: 'Affiliate Disclosure',
    content: `
# Affiliate Disclosure Statement

**Last Updated: ${new Date().toLocaleDateString()}**

## 1. FTC Compliance Statement

In accordance with the Federal Trade Commission's 16 CFR § 255.5: Guides Concerning the Use of Endorsements and Testimonials in Advertising, we want to be completely transparent about our affiliate relationships and how we monetize our website.

## 2. What Are Affiliate Links?

### 2.1 Definition
Affiliate links are special URLs that contain tracking codes. When you click these links and make a purchase, we may receive:
- A commission
- Referral fee
- Other compensation

### 2.2 How They Work
- You click our link
- Your visit is tracked
- We earn if you make a purchase
- No additional cost to you

## 3. Our Affiliate Relationships

### 3.1 Current Partners
We maintain affiliate relationships with:
- Amazon Associates Program
- Major pet supply retailers
- Pet food manufacturers
- Pet product brands

### 3.2 Compensation Types
We may receive:
- Percentage of sales
- Fixed commission
- Store credit
- Product samples

## 4. Editorial Integrity

### 4.1 Our Commitment
- Unbiased reviews
- Honest recommendations
- Transparent disclosure
- User-first approach

### 4.2 Product Selection
Our recommendations are based on:
- Product quality
- User reviews
- Market research
- Personal testing
- Professional expertise

## 5. Disclosure in Content

### 5.1 Where We Disclose
- Product reviews
- Buying guides
- Comparison articles
- Email newsletters
- Social media posts

### 5.2 How We Disclose
- Clear language
- Prominent placement
- Easy to understand
- Regular updates

## 6. Your Understanding

### 6.1 What This Means
By using our website, you acknowledge:
- We may be compensated
- Links may be affiliate links
- Prices and availability may vary
- We strive for accuracy

### 6.2 Your Rights
You are free to:
- Use non-affiliate links
- Research independently
- Make informed decisions
- Contact us with questions

## 7. Compensation Impact

### 7.1 Editorial Independence
- Compensation doesn't influence reviews
- All opinions are genuine
- Products independently evaluated
- Negative reviews published

### 7.2 Product Selection
We select products based on:
- Quality
- Value
- User needs
- Market demand

## 8. Additional Disclosures

### 8.1 Product Reviews
- Some products provided free
- Testing period disclosed
- Return policies noted
- Updates maintained

### 8.2 Price Information
- Prices may change
- Real-time accuracy not guaranteed
- Regional variations exist
- Shipping costs vary

## 9. Contact Information

For questions about our affiliate relationships:
- Email: affiliates@pawfectfind.com
- Address: [Business Address]
- Phone: [Phone Number]

## 10. Updates to This Disclosure

### 10.1 Changes
- Updated as needed
- New partnerships added
- Terms modified
- Policies revised

### 10.2 Notification
- Posted on website
- Date stamped
- Archive maintained
- Email notification for major changes

This Affiliate Disclosure is effective as of the Last Updated date above and will remain in effect except with respect to any changes in its provisions in the future.
    `
  }
};

const LegalPage: React.FC = () => {
  const { page } = useParams<{ page: keyof typeof legalContent }>();
  const content = page ? legalContent[page] : null;

  if (!content) {
    return <div>Page not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title={`${content.title} - PawfectFind`}
        description={`${content.title} for PawfectFind - Your trusted pet product discovery platform`}
      />
      
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <div 
          className="legal-content"
          dangerouslySetInnerHTML={{ 
            __html: content.content
              .replace(/^### (.*$)/gim, '<h3>$1</h3>')
              .replace(/^## (.*$)/gim, '<h2>$1</h2>')
              .replace(/^# (.*$)/gim, '<h1>$1</h1>')
              .replace(/\n/g, '<br />')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/- (.*?)(?=<br \/>|$)/g, '• $1')
          }} 
        />
      </article>
    </div>
  );
};

export default LegalPage;