import { defineField, defineType } from "sanity";

export const testimonials=defineType({
    name: "testimonials",
    title: "Testimonials",
    type: "document",
    
    fields: [
        defineField({
            name: "review",
            type: "localeBlockContent",
            title: "Review",
            validation: rule=> rule.required().error('User review is require')
        }),
        defineField({
            name: "avatar",
            title: "Avtar",
            type: "image",
            description: 'Image size should be 50x50 pixels',
            options: { hotspot: true },
        }),
        defineField({
            name: "name",
            type: "localeString",
            title: "Name (Localized)",
            validation: rule=> rule.required().error('User name is require')
        }),
        defineField({
            name: "profession",
            title: "Profession",
            type: "string",
        }),
        defineField({
            name: "stars",
            type: "string",
            title: "Stars",
            initialValue: '5',
            options: {
              list: [
                { title: '1', value: '1' },
                { title: '2', value: '2' },
                { title: '3', value: '3' },
                { title: '4', value: '4' },
                { title: '5', value: '5' },
              ],
            }
        }),
    ],
    preview: {
        select: {
          title: "name.en",       // or your default locale
          subtitle: "profession",
          media: "avatar",
        },
        prepare({ title, subtitle, media }) {
          return {
            title: title || "Unnamed User",
            subtitle: subtitle || "Testimonials",
            media,
          };
        },
      }     
})