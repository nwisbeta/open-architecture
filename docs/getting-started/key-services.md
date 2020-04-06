---
title: Key Services for Integration
group: getting-started
---
## Overview
This page provides a summary of elements in the NHS Wales digital architecture likely to be useful when integrating an application.

The following areas are covered:
 - **User Authentication/Authorization**: NADEX, AC3
 - **Reference Data**: WRDS, Terminology Service
 - **Messaging Components**: Enterprise Service Bus, WCCG, Requesting Services
 - **Patient Identity and Demographics**: WDS, MPI
 - **Patient Record**: WGPR, WCRS, WRRS

Note that NHS Wales is structured as [7 Local Health Boards and 3 All Wales Services](http://www.wales.nhs.uk/nhswalesaboutus/structure). Some systems are developed by the health boards individually but key national services are developed and maintained by the NHS Wales Informatics Service (NWIS - currently part of Velindre Trust) 


## User Authentication and Authorization
There are two centrally managed identity services that provide a way to authenticate and authorise users:
 - NADEX (National Active Directory Exchange)
 - AC3 (Account Control v3)

NADEX is the preferred option.  It is used throughout Secondary and Primary care and virtually all NHS staff are assigned a NADEX account.  

AC3 is provided as an alternative to NADEX in cases where it is not feasible to securely connect to Active Directory.  Applications using AC3 for identity management typically include additional instrumentation to log application events back to the National Audit Solution (NIIAS).


## Reference Data
The Welsh Reference Data Service (WRDS) caches data from different sources and provides a common API to query the following types of reference data:

- Organisational, such as Hospital Codes, Site Locations and GP Numbers.
- Informational Standards, e.g. code lists for Gender, Ethnicity, etc. 
- Clinical, such as Drugs and Medicines Formularies, Pathology Test Codes 

To support adoption of SNOMED CT, a new Terminology Service will be deployed with a [FHIR conformant API](http://hl7.org/implement/standards/fhir/terminology-module.html). Initially only SNOMED data will be available, but it is expected that other reference data will be queryable from this service in future.


## Messaging Components
Below are three of the most relevant components of the national messaging infrastructure.

- The Enterprise Service Bus is configured to route and transform messages between systems (e.g. discharge notifications and advice letters)
- The Welsh Clinical Communication Gateway (WCCG) Service provides an API to send electronic referrals and clinical documents.
- Test Requesting Services (part of WRRS) handle requests for Radiology and Pathology Tests to provide improved visibility of the request queue.


## Patient Identity and Demographics
Identity and demographic information go hand in hand, as patients will normally identify themselves by providing their name, date of birth and address.

There are two key systems used for patient identification
 - Welsh Demographics Service (WDS)
 - The Master Patient Index (MPI)

WDS provides patient demographic data linked to NHS Number.  It supports searches by NHS Number or by information such as name and date of birth.  It is often used to look up NHS Number and synchronise patient information across systems.

The MPI primarily acts a cross reference of locally assigned patient identifiers. For example, each Local Health Board has a separate Patient Administration Systems (PAS), which assigns their own "Hospital Numbers" to patients.  The PAS system is registered as an *Issuing Authority* with the MPI, so when a PAS publishes the identifier with the corresponding demographic information, the MPI runs matching algorithms to link it to identifiers from other systems.

The MPI supports identifier lookup with the [PIX](https://wiki.ihe.net/index.php/Patient_Identifier_Cross-Referencing) and the [Patient Demographics Query](https://wiki.ihe.net/index.php/Patient_Demographics_Query) profiles defined by IHE.


## Patient Record
There is no single source of the patient record.  It is fragmented across systems in different localities, specialities and care contexts, but there are three nationally available services for retrieving key parts of the patient record.

- Welsh GP Record (WGPR): Provides access to information recorded on GP systems, e.g. Diagnoses, Problems, Medications 
- Welsh Care Records Service (WCRS): A document repository with an API to store, retrieve and search for Clinical Documents with associated metadata.
- Welsh Results Reports Service (WRRS): Repository of Pathology and Radiology Test Results.  Includes APIs to support Graphing and Tabulation of multiple results.







