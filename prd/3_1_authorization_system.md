# 3.1 Authorization System

## User Roles and Permissions

The CNC Machine Shop Tool Library Web Application implements a comprehensive role-based access control (RBAC) system to ensure that users have appropriate access to system functionality based on their responsibilities within the organization. The system defines three distinct user roles, each with a specific set of permissions and access rights:

### Admin Role
The Admin role represents the highest level of system access and is typically assigned to shop managers, IT personnel, or other individuals with overall responsibility for system governance. Administrators have unrestricted access to all system features and functionality, including:

- User management (create, edit, delete, and assign roles to user accounts)
- Tool category management (create, edit, and delete tool categories and their attributes)
- Tool management (full CRUD operations on all tools)
- Purchase history management (view, add, edit, and delete purchase records)
- Part history management (view, add, edit, and delete usage records)
- System configuration and settings
- Access to all reports and export functions
- Dashboard view and configuration

Administrators are responsible for the initial system setup, ongoing maintenance, and ensuring that the system configuration aligns with organizational policies and procedures. They serve as the primary point of contact for resolving system issues and implementing changes to system functionality.

### Manager Role
The Manager role represents an intermediate level of access appropriate for shop supervisors, lead machinists, or procurement specialists who need comprehensive tool management capabilities but do not require system administration functions. Managers have access to:

- Tool category management (create, edit, and delete tool categories and their attributes)
- Tool management (full CRUD operations on all tools)
- Purchase history management (view, add, edit, and delete purchase records)
- Part history management (view, add, edit, and delete usage records)
- Access to all reports and export functions
- Dashboard view

Managers cannot create or modify user accounts or access system configuration settings. Their primary responsibility is maintaining the tool library, including adding new tools, updating existing tool information, tracking purchases, and monitoring inventory levels.

### User Role
The User role represents the basic level of access appropriate for machine operators, setup technicians, and other shop floor personnel who need to interact with the tool library as part of their daily work. Users have limited access focused on day-to-day operations:

- Tool viewing (search and view tool details)
- Tool check-out (remove tools from inventory for use on specific jobs)
- Part history recording (record tool usage against job and part numbers)
- Basic reports and exports related to their own activities

Users cannot add, modify, or delete tools or tool categories. They cannot modify purchase history records. Their primary responsibilities include finding tools needed for their assigned jobs, checking out tools from inventory, and recording tool usage information.

This three-tiered role structure provides appropriate access controls while maintaining operational efficiency. The system is designed to be intuitive for all user levels, with interfaces tailored to the specific needs and permissions of each role.

## Authentication Flow

The authentication process in the CNC Machine Shop Tool Library Web Application follows industry best practices for security while maintaining a streamlined user experience. The authentication flow consists of the following steps:

1. **User Login**: The process begins when a user navigates to the application login page and enters their username and password. The login form includes basic client-side validation to ensure that required fields are completed before submission.

2. **Credential Transmission**: When the user submits the login form, the credentials are transmitted to the backend server via a secure HTTPS connection. The password is never stored in plain text, either in transit or at rest.

3. **Credential Verification**: Upon receiving the login request, the backend server retrieves the user record from the database based on the provided username. If no matching user is found, the authentication fails immediately.

4. **Password Verification**: If a matching user is found, the server uses the bcrypt library to compare the provided password with the stored password hash. Bcrypt automatically handles the salt extraction and comparison process, ensuring secure password verification.

5. **JWT Token Generation**: Upon successful authentication, the server generates a JSON Web Token (JWT) containing the user's identity (ID, username) and role (admin, manager, or user). The token is signed using a secure server-side secret to prevent tampering.

6. **Token Transmission**: The generated JWT token is returned to the client application as part of the login response.

7. **Token Storage**: The client application stores the JWT token in memory for the duration of the user session. For improved user experience on trusted devices, the token may optionally be stored in localStorage to enable persistent sessions.

8. **Authenticated Requests**: For all subsequent requests to protected API endpoints, the client application includes the JWT token in the Authorization header using the Bearer scheme.

9. **Token Verification**: The server verifies the JWT token's signature and expiration for each request to protected endpoints. If the token is valid, the request proceeds; if invalid or expired, the server returns a 401 Unauthorized response.

10. **Role-Based Access Control**: After token verification, the server extracts the user's role from the JWT payload and checks whether the user has sufficient permissions for the requested operation. If the user lacks the necessary permissions, the server returns a 403 Forbidden response.

11. **Session Expiration**: JWT tokens have a configured expiration time (typically 24 hours). When a token expires, the user must re-authenticate to continue using the application.

12. **Logout Process**: When a user logs out, the client application discards the JWT token from memory (and localStorage if used), effectively ending the session.

This authentication flow provides a secure, stateless authentication mechanism that scales well and supports the role-based access control requirements of the application.

## Security Requirements

The CNC Machine Shop Tool Library Web Application implements comprehensive security measures to protect sensitive tool data, user credentials, and system functionality. The following security requirements must be met:

### Password Security
- All user passwords must be hashed using bcrypt with an appropriate work factor (minimum 10 rounds) before storage.
- Password requirements must enforce minimum complexity: at least 8 characters, including uppercase, lowercase, numbers, and special characters.
- Password reset functionality must use secure, time-limited tokens sent to verified email addresses.
- Failed login attempts should be rate-limited to prevent brute force attacks.

### Data Protection
- All communication between client and server must use HTTPS encryption to protect data in transit.
- Sensitive data in the database (e.g., passwords) must be properly hashed or encrypted.
- File uploads (e.g., purchase order PDFs) must be validated for type, size, and content before storage.
- Database queries must use parameterized statements or ORM features to prevent SQL injection attacks.

### Access Control
- All API endpoints must implement appropriate authorization checks based on user roles.
- Frontend routes must be protected based on user roles, preventing unauthorized access to restricted features.
- API responses must not include sensitive data beyond what is necessary for the requesting user's role.
- Session management must include appropriate timeout and renewal mechanisms.

### Input Validation
- All user inputs must be validated on both client and server sides using Zod schemas.
- Input validation must check for appropriate data types, ranges, and formats.
- Special attention must be paid to validating dynamic attributes for tools, as these vary by category.
- File uploads must be scanned for malicious content and restricted to approved file types (PDF, Excel, etc.).

### Audit and Logging
- The system must maintain logs of significant security events (login attempts, permission changes, etc.).
- Tool inventory changes must be tracked with user attribution for accountability.
- Critical operations (user creation, role changes, tool deletion) should require confirmation and be logged.

### Infrastructure Security
- The application must be deployable in environments with appropriate network security controls.
- Database access must be restricted to the application server only, not directly exposed to clients.
- Regular security updates must be applied to all system components (OS, database, libraries).
- Backup procedures must include appropriate encryption for sensitive data.

These security requirements establish a robust foundation for protecting the integrity, confidentiality, and availability of the tool library system and its data.

## JWT Implementation

The JSON Web Token (JWT) implementation in the CNC Machine Shop Tool Library Web Application follows industry best practices to ensure secure authentication and authorization. The following details specify how JWTs are structured and utilized within the system:

### Token Structure
Each JWT consists of three parts: a header, a payload, and a signature, concatenated with periods:

1. **Header**: Contains the token type and the signing algorithm used.
   ```json
   {
     "alg": "HS256",
     "typ": "JWT"
   }
   ```

2. **Payload**: Contains claims about the user and token validity.
   ```json
   {
     "sub": "user123",       // Subject (user ID)
     "name": "John Smith",   // User's name
     "role": "manager",      // User's role (admin, manager, user)
     "iat": 1625097600,      // Issued at timestamp
     "exp": 1625184000       // Expiration timestamp
   }
   ```

3. **Signature**: Created by signing the encoded header and payload using a secret key.

### Token Generation
JWT tokens are generated by the server during the authentication process:

1. Upon successful username/password verification, the server creates a JWT payload containing the user's ID, name, role, and appropriate timestamps.
2. The server signs the token using a secure, randomly generated secret key stored in server environment variables.
3. The complete JWT is returned to the client as part of the authentication response.

### Token Validation
For each request to a protected API endpoint, the server validates the JWT:

1. The server extracts the JWT from the Authorization header (Bearer scheme).
2. The server verifies the token's signature using the same secret key used for signing.
3. The server checks that the token has not expired by examining the "exp" claim.
4. If the token is valid, the server extracts the user information and role from the payload.
5. The extracted role is used to determine whether the user has permission for the requested operation.

### Token Management
The application implements the following token management practices:

1. **Token Expiration**: JWTs have a configurable expiration time, typically set to 24 hours. This limits the window of opportunity if a token is compromised.

2. **Token Storage**: On the client side, tokens are primarily stored in memory to prevent exposure to XSS attacks. For improved user experience, tokens may optionally be stored in localStorage on trusted devices, with appropriate warnings to users about the security implications.

3. **Token Renewal**: The application may implement a token renewal mechanism that issues a new token before the current one expires, allowing for extended sessions without requiring re-authentication.

4. **Token Revocation**: While JWTs are stateless by design and cannot be directly revoked, the application maintains a small blacklist of invalidated tokens (e.g., after explicit logout) with short time-to-live values matching the original token expiration.

### Security Considerations
The JWT implementation includes several security measures:

1. **HTTPS Only**: JWTs are only transmitted over HTTPS connections to prevent token interception.

2. **Appropriate Claims**: The JWT payload contains only the necessary information for authentication and authorization, avoiding the inclusion of sensitive user data.

3. **Secure Secrets**: The signing secret is a high-entropy value stored securely in environment variables, not in the codebase.

4. **XSS Protection**: The application implements appropriate Content Security Policy headers and other XSS protections to prevent token theft via script injection.

This JWT implementation provides a secure, stateless authentication mechanism that supports the role-based access control requirements of the application while maintaining good performance and scalability.
