import { defineType, defineField } from "sanity";

export const customImage = defineType({
    name: "customImage",
    type: "object",
    title: "Image Component",

    fields: [
        defineField({
            name: "image",
            type: "image",
            title: "Image",
            options: {
                hotspot: true,
            },
        }),

        defineField({
            name: "altText",
            type: "string",
            title: "Alternative Text",
            validation: (Rule) =>
                Rule.custom((value, context) => {
                    const { image } = context.parent as { image?: unknown };

                    if (image && !value) {
                        return "Alternative Text is required when image is added";
                    }

                    return true;
                }),
        }),
        defineField({
            name: "isImageFullWidth",
            type: "boolean",
            title: "Is image full width",
        }),

    ],
    preview: {
        select: {
            image: "image",
            title: "altText",
        },
        prepare(selection) {
            const { image, title } = selection;
            return {
                title: title || "Custom Image",
                media: image,
                subtitle: "Custom Image",
            };
        },
    }
})
