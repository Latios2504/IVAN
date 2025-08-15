# Certificate Frontend Integration

This document describes the frontend integration for Certificate and Certificate Template functionality, matching the backend `CertificateController` and `CertificateTemplateController`.

## Complete Certificate System Flow

### **Role-Based Access & Functionality:**

#### **1. Organization Role** 📋

- **Certificate Management Page** (`/organization/certificates`)

  - Create certificates for volunteers after events
  - Approve/Reject certificate requests
  - Manage organization's issued certificates
  - View certificate analytics and download statistics

- **Template Management Page** (`/organization/certificate-templates`)
  - Create custom certificate templates
  - Manage organization-specific templates
  - Use system default templates

#### **2. Admin Role** 🔧

- **System-wide Certificate Management**

  - Oversee all certificates across organizations
  - Handle certificate disputes and issues
  - Access comprehensive analytics

- **Template Management**
  - Manage system default templates
  - Approve organization templates (if workflow needed)
  - Control template availability

#### **3. Volunteer Role** 🎓

- **Certificate Portfolio Page** (`/volunteer/certificates`) ✅ **NEW**
  - View all personal certificates from events
  - Download certificates as PDF
  - Track certificate status and expiry

#### **4. Coordinator Role** 👥

- **Event Certificate Management**
  - View certificates for coordinated events
  - Recommend volunteers for certificates
  - Track volunteer performance for eligibility

### **Recommended Certificate Workflow:**

```
Event Completion → Coordinator Review → Organization Approval → Certificate Issued → Volunteer Access
      ↓                    ↓                      ↓                    ↓                  ↓
   [Automatic]      [Manual/Auto]          [Manual Approval]    [Auto Status]    [Self-Service]
```

## Files Created

### Types

- `src/types/certificate.ts` - All TypeScript interfaces and types for certificates and templates

### Services

- `src/services/certificateService.ts` - Certificate management service
- `src/services/certificateTemplateService.ts` - Certificate template management service

### Pages

- `src/pages/organization/CertificateManagementPage.tsx` - Organization certificate management ✅ **EXISTING**
- `src/pages/organization/CertificateTemplateManagementPage.tsx` - Template management ✅ **NEW**
- `src/pages/volunteer/VolunteerCertificatesPage.tsx` - Volunteer certificate portfolio ✅ **NEW**

## Template Management Flow

### **For Organizations:**

1. **Browse System Templates** - View available default templates
2. **Customize Templates** - Create organization-specific templates based on defaults
3. **Template Library** - Manage custom templates for different event types
4. **Template Assignment** - Assign templates to specific events or certificate types

### **For Admins:**

1. **System Template Creation** - Create templates available to all organizations
2. **Template Approval** - Review and approve organization templates (optional workflow)
3. **Template Distribution** - Control which templates are available to which organizations

### **Template Hierarchy:**

```
System Templates (Admin-created)
    ↓ Available to all organizations
Organization Templates (Org-created)
    ↓ Available only to that organization
Event-Specific Templates
    ↓ Used for specific events
```

## Usage Examples

### 1. Certificate Service Usage

```typescript
import { certificateService } from "@/services/certificateService";
import type {
  CreateCertificateRequest,
  CertificateFilterModel,
} from "@/types/certificate";

// Get paginated certificates
const certificates = await certificateService.getCertificates(1, 10);

// Get certificates by organization
const orgCertificates = await certificateService.getCertificatesByOrganization(
  123,
  1,
  10
);

// Filter certificates
const filter: CertificateFilterModel = {
  pageNumber: 1,
  pageSize: 10,
  status: "Approved",
  organizationId: 123,
  searchTerm: "volunteer name",
};
const filteredCertificates = await certificateService.getFilteredCertificates(
  filter
);

// Get specific certificate
const certificate = await certificateService.getCertificateById(1);

// Create new certificate
const newCertificate: CreateCertificateRequest = {
  volunteerId: 123,
  eventId: 456,
  templateId: 789,
  certificateName: "Volunteer Participation Certificate",
  description: "Certificate for participating in community service",
  hoursCompleted: 40,
  performanceLevel: "Excellent",
};
const createdCertificate = await certificateService.createCertificate(
  newCertificate
);

// Update certificate
await certificateService.updateCertificate(1, {
  certificateName: "Updated Certificate Name",
  status: "Approved",
});

// Approve certificate
await certificateService.approveCertificate({
  certificateId: 1,
  approvalNotes: "Excellent work",
  approvedBy: 123,
});

// Reject certificate
await certificateService.rejectCertificate({
  certificateId: 1,
  rejectionReason: "Incomplete requirements",
  rejectedBy: 123,
});

// Bulk operations
await certificateService.bulkApproveCertificates({
  certificateIds: [1, 2, 3],
  reason: "Batch approval",
  approvedBy: 123,
});

// Download certificate
await certificateService.downloadCertificateFile(1); // Automatically triggers download

// Delete certificate
await certificateService.deleteCertificate(1);
```

### 2. Certificate Template Service Usage

```typescript
import { certificateTemplateService } from "@/services/certificateTemplateService";
import type { CreateCertificateTemplateRequest } from "@/types/certificate";

// Get paginated templates
const templates = await certificateTemplateService.getCertificateTemplates(
  1,
  10
);

// Get specific template
const template = await certificateTemplateService.getCertificateTemplateById(1);

// Get active templates (for dropdowns)
const activeTemplates = await certificateTemplateService.getActiveTemplates();

// Get templates by organization
const orgTemplates =
  await certificateTemplateService.getTemplatesByOrganization(123);

// Get default templates
const defaultTemplates = await certificateTemplateService.getDefaultTemplates();

// Create new template
const newTemplate: CreateCertificateTemplateRequest = {
  templateName: "Volunteer Participation Template",
  description: "Standard template for volunteer participation certificates",
  templateType: "Participation",
  templateDesign: "modern-blue-design",
  requiredFields: JSON.stringify(["volunteerName", "eventName", "issueDate"]),
  organizationId: 123,
  isDefault: false,
  isActive: true,
};
const createdTemplate =
  await certificateTemplateService.createCertificateTemplate(newTemplate);

// Utility methods
const templateTypes = certificateTemplateService.getTemplateTypes();
const commonFields = certificateTemplateService.getCommonRequiredFields();
const requiredFields = certificateTemplateService.parseRequiredFields(
  template.requiredFields
);
```

### 3. React Component Examples

#### Certificate List Component

```typescript
import React, { useState, useEffect } from "react";
import { certificateService } from "@/services/certificateService";
import type { CertificateViewModel } from "@/types/certificate";

export function CertificateList() {
  const [certificates, setCertificates] = useState<CertificateViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadCertificates();
  }, [currentPage]);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const result = await certificateService.getCertificates(currentPage, 10);
      setCertificates(result.items);
    } catch (error) {
      console.error("Failed to load certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      await certificateService.downloadCertificateFile(id);
    } catch (error) {
      console.error("Failed to download certificate:", error);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await certificateService.approveCertificate({
        certificateId: id,
        approvalNotes: "Approved",
        approvedBy: 1, // Current user ID
      });
      loadCertificates(); // Reload list
    } catch (error) {
      console.error("Failed to approve certificate:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Certificates</h2>
      {certificates.map((certificate) => (
        <div key={certificate.certificateId} className="certificate-item">
          <h3>{certificate.certificateName}</h3>
          <p>Status: {certificate.status}</p>
          <p>Volunteer ID: {certificate.volunteerId}</p>
          <p>Event ID: {certificate.eventId}</p>
          <button onClick={() => handleDownload(certificate.certificateId)}>
            Download PDF
          </button>
          {certificate.status === "Pending" && (
            <button onClick={() => handleApprove(certificate.certificateId)}>
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

#### Certificate Creation Form

```typescript
import React, { useState, useEffect } from "react";
import { certificateService } from "@/services/certificateService";
import { certificateTemplateService } from "@/services/certificateTemplateService";
import type {
  CreateCertificateRequest,
  CertificateTemplateViewModel,
} from "@/types/certificate";

export function CreateCertificateForm() {
  const [templates, setTemplates] = useState<CertificateTemplateViewModel[]>(
    []
  );
  const [formData, setFormData] = useState<CreateCertificateRequest>({
    volunteerId: 0,
    eventId: 0,
    templateId: 0,
    certificateName: "",
    description: "",
    hoursCompleted: 0,
    performanceLevel: "",
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const result = await certificateTemplateService.getActiveTemplates();
      setTemplates(result.items);
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate data
      const errors = certificateService.validateCertificateData(formData);
      if (errors.length > 0) {
        alert("Validation errors: " + errors.join(", "));
        return;
      }

      await certificateService.createCertificate(formData);
      alert("Certificate created successfully!");
      // Reset form or redirect
    } catch (error) {
      console.error("Failed to create certificate:", error);
      alert("Failed to create certificate");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Certificate Name:</label>
        <input
          type="text"
          value={formData.certificateName}
          onChange={(e) =>
            setFormData({ ...formData, certificateName: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label>Volunteer ID:</label>
        <input
          type="number"
          value={formData.volunteerId}
          onChange={(e) =>
            setFormData({ ...formData, volunteerId: parseInt(e.target.value) })
          }
          required
        />
      </div>

      <div>
        <label>Event ID:</label>
        <input
          type="number"
          value={formData.eventId}
          onChange={(e) =>
            setFormData({ ...formData, eventId: parseInt(e.target.value) })
          }
          required
        />
      </div>

      <div>
        <label>Template:</label>
        <select
          value={formData.templateId}
          onChange={(e) =>
            setFormData({ ...formData, templateId: parseInt(e.target.value) })
          }
          required
        >
          <option value={0}>Select a template</option>
          {templates.map((template) => (
            <option key={template.templateId} value={template.templateId}>
              {template.templateName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Description:</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div>
        <label>Hours Completed:</label>
        <input
          type="number"
          value={formData.hoursCompleted}
          onChange={(e) =>
            setFormData({
              ...formData,
              hoursCompleted: parseFloat(e.target.value),
            })
          }
        />
      </div>

      <div>
        <label>Performance Level:</label>
        <select
          value={formData.performanceLevel}
          onChange={(e) =>
            setFormData({ ...formData, performanceLevel: e.target.value })
          }
        >
          <option value="">Select performance level</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Satisfactory">Satisfactory</option>
        </select>
      </div>

      <button type="submit">Create Certificate</button>
    </form>
  );
}
```

## API Response Format

All services return data in the `ApiResponse<T>` format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[];
}
```

Paginated responses use `PagedResultDto<T>`:

```typescript
interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
```

## Error Handling

All services include proper error handling and will throw meaningful error messages. Always wrap service calls in try-catch blocks:

```typescript
try {
  const result = await certificateService.getCertificates();
  // Handle success
} catch (error) {
  console.error("Service error:", error);
  // Handle error (show toast, update UI, etc.)
}
```

## Authentication

The services automatically handle authentication through the `apiClient`. Make sure the user is logged in and has a valid token before making requests to protected endpoints.

## Backend Compatibility

These frontend types and services are designed to match exactly with:

- `CertificateController` endpoints and DTOs
- `CertificateTemplateController` endpoints and DTOs
- All request/response models from the backend

The services handle .NET JSON serialization format (with `$values` properties) automatically.
