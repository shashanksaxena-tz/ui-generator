# Taazaa Response to City of Dublin Technical Requirements

**Date:** February 24, 2026
**Prepared by:** Taazaa Inc.
**Prepared for:** City of Dublin Information Technology

---

## 1. Datacenter Security and Operations

### 1.1 Redundancy – Are there multiple locations for Taazaa DC? Geo-located for redundancy?

*[PENDING — Taazaa to provide details on datacenter locations, geographic redundancy strategy, and failover capabilities.]*

### 1.2 Does Taazaa have its own cybersecurity team? If not, is it outsourced?

Yes, Taazaa maintains its own dedicated in-house cybersecurity team. This team is responsible for continuous monitoring, threat detection, incident response, vulnerability management, and ensuring compliance with applicable security standards across all hosted environments, including the City of Dublin deployment.

### 1.3 Is the Taazaa DC SOC2 certified?

Yes, Taazaa is SOC 2 certified. Our SOC 2 Type II certification covers the Trust Services Criteria relevant to security, availability, and confidentiality. We can provide the most recent SOC 2 audit report to the City of Dublin under NDA upon request.

### 1.4 How do they ensure exposure from outside the US is blocked? Government data cannot reside outside the United States and access to any data must be documented and approved by Dublin.

*[PENDING — Taazaa to provide details on:*
- *Geographic access restrictions (e.g., geo-IP blocking, firewall rules)*
- *Data residency guarantees ensuring all data remains within US-based infrastructure*
- *Access control and audit logging procedures for documenting and approving data access]*

---

## 2. VPN

*[PENDING — Taazaa to provide recommendation on whether a site-to-site VPN is required or whether the solution can be securely accessed over the public internet with appropriate controls (TLS, WAF, IP whitelisting, etc.). Consideration should be given to the City of Dublin's preference to allow Tax department employees to work remotely with direct internet access to Civi.]*

---

## 3. Data Flow

### 3.1 From and To AI – Guardrails around each AI and how it processes data

*[PENDING — Taazaa to provide documentation detailing:*
- *What data is passed to Civi's third-party AI tools and resources*
- *What guardrails are in place to prevent PII from being transmitted to external AI services*
- *Data minimization practices applied before AI processing*
- *Whether AI processing occurs within Taazaa's infrastructure or via external API calls]*

### 3.2 Data Flow Documentation

*[PENDING — Taazaa to provide a comprehensive data flow diagram showing how personal data is routed through the Civi and Taazaa systems, including ingress, processing, storage, and egress points.]*

---

## 4. Keycloak and Authentication

### 4.1 Keycloak Version

Taazaa acknowledges that the current Keycloak deployment is not on the latest version. We will upgrade to the latest stable release of Keycloak (currently 26.x) prior to the go-live date. This upgrade will include all current security patches and feature enhancements.

### 4.2 Can Taazaa use SAML for Dublin employees?

*[PENDING — Taazaa to confirm whether SAML-based Single Sign-On (SSO) integration is supported for Dublin employee authentication, enabling Dublin staff to authenticate using their existing identity provider.]*

### 4.3 How are residents getting 2FA – is this what Keycloak is being used for?

*[PENDING — Taazaa to describe the resident-facing 2FA mechanism, including:*
- *Whether Keycloak is the identity and 2FA provider for residents*
- *What 2FA methods are supported (SMS, authenticator app, email, etc.)]*

### 4.4 How do they protect 2FA? How is it architected? Is it redundant? Is there a chance that on April 15, 2FA will go down and we will not receive tax returns?

*[PENDING — Taazaa to provide:*
- *Architecture diagram for the 2FA infrastructure*
- *Redundancy and high-availability measures for the authentication stack*
- *SLA commitments for uptime during critical tax filing periods (e.g., April 15 deadline)*
- *Disaster recovery and failover procedures specific to the authentication system]*

---

## 5. Spring Cloud Gateway

*[PENDING — Taazaa to provide an overview of Spring Cloud Gateway's role in the solution architecture, including:*
- *Its purpose as an API gateway / reverse proxy*
- *How it handles request routing, rate limiting, and security filtering*
- *How it integrates with Keycloak for authentication/authorization]*

---

## 6. Log Integration with LogRhythm

*[PENDING — Taazaa to provide details on:*
- *Log formats and transport protocols available (syslog, API, file-based)*
- *What events are logged (authentication, data access, administrative actions, etc.)*
- *Integration approach for forwarding logs to Dublin's LogRhythm SIEM or internal log collector*
- *Support for anomaly alerting (e.g., geographically inconsistent login detection)]*

---

## 7. SendGrid – Email Communications

*[PENDING — Taazaa to provide details on:*
- *How SendGrid is used to communicate with tax employees, residents, and Dublin businesses*
- *What types of emails are sent (notifications, tax documents, account alerts)*
- *Whether email content contains PII and how it is protected in transit]*

---

## 8. Payment Processor

*[PENDING — Requires engagement with Dublin's Finance Accounts Receivable Team. Taazaa to clarify:*
- *Proposed payment processing architecture*
- *PCI DSS compliance scope and responsibility matrix (Taazaa vs. Dublin)*
- *Whether a PCI-compliant third-party processor is used to minimize Dublin's PCI compliance burden]*

---

## 9. Tenant Separation

*[PENDING — Taazaa to provide details on:*
- *Physical and logical tenant separation measures in the Taazaa datacenter*
- *Network segmentation, storage isolation, and access control between tenants*
- *Whether Dublin's environment can optionally be hosted in AWS/Azure if required*
- *Willingness to enter into an operational/legal agreement covering tenant separation guarantees]*

---

## 10. Data Retention

*[PENDING — Taazaa to confirm:*
- *Proposed data retention period (Dublin has suggested 7 years)*
- *Data purging and secure deletion procedures after the retention period expires*
- *Ability to customize retention policies per Dublin's requirements]*

---

## Next Steps

1. Taazaa to complete all **[PENDING]** sections above and return the updated document to the City of Dublin IT team for review.
2. Schedule a follow-up technical call to discuss responses and any outstanding questions.
3. Begin drafting the operational/legal agreement for tenant separation and data handling.
4. Engage Dublin Finance Accounts Receivable Team for payment processor discussions.
5. Target completion of all technical documentation prior to the July 2026 go-live date.
