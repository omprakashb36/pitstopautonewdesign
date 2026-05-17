import { defineField, defineType } from "sanity";

export const faq = defineType({
    name: "faq",
    title: "FAQs",
    type: "document",
    validation: rule => rule.custom(fields => {
        if (fields && ((fields.question && fields.answer) || (!fields.question && !fields.answer))) {
            return true;
        }
        return "Both 'question' and 'answer' must be filled or both must be empty.";
    }),
    fields: [
        defineField({
            name: "question",
            title: "Question (Localized)",
            type: "localeString",
        }),
        defineField({
            name: "answer",
            title: "Answer (Localized)",
            type: "localeBlockContent",
        }),
    ],
    preview: {
        select: {
          title: "question.en",      // or use a default locale like 'en'
          subtitle: "answer.en"
        },
        prepare({ title }) {
          return {
            title: title || "Untitled FAQ",
            subtitle: "FAQs",
          };
        },
      }
})