"use server"
import sgMail, { MailDataRequired } from "@sendgrid/mail";

type Props = {
  to: string;
  templateId: string;
  dynamicTemplateData?: Record<string, string>;
};

export const sendEmail = async ({
  to,
  templateId,
  dynamicTemplateData,
}: Props) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const fromName = process.env.SENDGRID_FROM_NAME;
  if(!fromEmail){
    console.log("Sendgrid Sender email not found! Kindly check environment variables")
    throw new Error("Sendgrid sender email not found!");
  }
  const msg : MailDataRequired = {
    to,
    from: {
      email: fromEmail,
      name: fromName ?? "Geely UAE",
    },
    templateId: templateId,
    dynamicTemplateData,
  };

  try {
    await sgMail.send(msg);
  } catch (error : any) {
    console.error("Server error :- " + error.message);
    throw new Error("Failed to send email");
  }
};
