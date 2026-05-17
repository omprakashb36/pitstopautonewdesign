import { defineField, defineType } from "sanity";

type LayoutParent = {
  layoutType?: "three" | "two" | "full";
};

export default defineType({
  name: "blogImage",
  title: "Blog Image",
  type: "object",

  fields: [
    // 🔹 RADIO BUTTON LAYOUT SELECTOR
    defineField({
      name: "layoutType",
      title: "Image Layout",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "3 Column Image", value: "three" },
          { title: "2 Column Image", value: "two" },
          { title: "Full Width Image", value: "full" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // 🔹 FULL WIDTH → 1 IMAGE
    defineField({
      name: "fullImage",
      title: "Full Width Image",
      type: "customImage",
      description: "Recommended size: 1200x600",
      hidden: ({ parent }) =>
        (parent as LayoutParent)?.layoutType !== "full",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const p = context.parent as LayoutParent;
          if (p?.layoutType === "full" && !value) {
            return "Please upload the full width image.";
          }
          return true;
        }),
    }),

    // 🔹 TWO COLUMN → 2 IMAGES
    defineField({
      name: "twoColImages",
      title: "Two Column Images",
      type: "array",
      of: [{ type: "customImage" }],
      hidden: ({ parent }) =>
        (parent as LayoutParent)?.layoutType !== "two",
      validation: (Rule) =>
        Rule.custom((images, context) => {
          const p = context.parent as LayoutParent;
          if (p?.layoutType === "two") {
            if (!images || images.length !== 2)
              return "Upload exactly 2 images.";
          }
          return true;
        }),
    }),

    // 🔹 THREE COLUMN → 3 IMAGES
    defineField({
      name: "threeColImages",
      title: "Three Column Images",
      type: "array",
      of: [{ type: "customImage" }],
      hidden: ({ parent }) =>
        (parent as LayoutParent)?.layoutType !== "three",
      validation: (Rule) =>
        Rule.custom((images, context) => {
          const p = context.parent as LayoutParent;
          if (p?.layoutType === "three") {
            if (!images || images.length !== 3)
              return "Upload exactly 3 images.";
          }
          return true;
        }),
    }),
  ],

  preview: {
    select: {
      title: "heading",
      subtitle: "subHeading",
      media: "fullImage",
    },
    prepare({ title, media }) {
      return {
        title: title || "blogImage",
        media,
      };
    },
  },
});
