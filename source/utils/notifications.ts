
export const ADMIN_WHATSAPP = "19176957737";
export const BRAND_NAME = "Digital Solutions Hub";

export type NotificationType = 'SIGNUP' | 'SERVICE_REQUEST' | 'COURSE_ENROLLMENT' | 'CERTIFICATE_ISSUED';

interface NotificationData {
  name: string;
  email?: string;
  phone?: string;
  details?: string; // Course name, Service category, etc.
}

export const sendNotifications = async (type: NotificationType, data: NotificationData) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log(`[Notification Service] Processing ${type} for ${data.email}...`);

  let adminMessage = "";
  let userMessage = "";

  switch (type) {
    case 'SIGNUP':
      adminMessage = `New User Signup:\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}`;
      userMessage = "Welcome! Your account has been created.";
      break;
    case 'SERVICE_REQUEST':
      adminMessage = `New Service Request:\nClient: ${data.name}\nService: ${data.details}\nPhone: ${data.phone}`;
      userMessage = "Request Received. Our team will contact you shortly.";
      break;
    case 'COURSE_ENROLLMENT':
      adminMessage = `New Course Enrollment:\nStudent: ${data.name}\nCourse: ${data.details}\nPhone: ${data.phone}`;
      userMessage = "Enrollment Pending. Please complete payment to activate.";
      break;
    case 'CERTIFICATE_ISSUED':
      adminMessage = `Certificate Issued:\nStudent: ${data.name}\nDetails: ${data.details}`;
      userMessage = `Congratulations! Your certificate for ${data.details} is ready. A copy has been sent to ${data.email}.`;
      console.log(`[Email Service] ðŸ“§ SENT: Certificate PDF attached for ${data.email}`);
      break;
  }

  // Encode for URL (Admin Notification)
  const encodedMessage = encodeURIComponent(`*${BRAND_NAME} Alert*\n\n${adminMessage}`);
  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;

  return {
    success: true,
    message: userMessage,
    adminUrl: whatsappUrl
  };
};
