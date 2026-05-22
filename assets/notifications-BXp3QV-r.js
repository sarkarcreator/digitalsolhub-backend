const r="19176957737",l="Digital Solutions Hub",a=async(n,e)=>{await new Promise(c=>setTimeout(c,800)),console.log(`[Notification Service] Processing ${n} for ${e.email}...`);let s="",o="";switch(n){case"SIGNUP":s=`New User Signup:
Name: ${e.name}
Email: ${e.email}
Phone: ${e.phone}`,o="Welcome! Your account has been created.";break;case"SERVICE_REQUEST":s=`New Service Request:
Client: ${e.name}
Service: ${e.details}
Phone: ${e.phone}`,o="Request Received. Our team will contact you shortly.";break;case"COURSE_ENROLLMENT":s=`New Course Enrollment:
Student: ${e.name}
Course: ${e.details}
Phone: ${e.phone}`,o="Enrollment Pending. Please complete payment to activate.";break;case"CERTIFICATE_ISSUED":s=`Certificate Issued:
Student: ${e.name}
Details: ${e.details}`,o=`Congratulations! Your certificate for ${e.details} is ready. A copy has been sent to ${e.email}.`,console.log(`[Email Service] 📧 SENT: Certificate PDF attached for ${e.email}`);break}const t=encodeURIComponent(`*${l} Alert*

${s}`),i=`https://wa.me/${r}?text=${t}`;return{success:!0,message:o,adminUrl:i}};export{a as s};
