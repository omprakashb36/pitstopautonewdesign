import {defineType, defineField} from "sanity";

export const customImage=defineType({
    name: "customImage",
    type: "object",
    title: "Image Component",
    
    fields:[
        defineField({
            name: "image",
            type: "image",
            title: "Image",
            validation :rule=> rule.required().error("please select image"),
            options:{
                hotspot:true,
            }
        }),
        defineField({
            name:"altText",
            type:"string",
            title: "Alternative Text",
            validation :rule=> rule.required().error("Please fill this field"),
        }),
        defineField({
            name:"isImageFullWidth",
            type:"boolean",
            title: "Is image full width",
        }),

    ],
    preview: {
        select: {
            image: "image",
            title: "altText",
        },
        prepare(selection) {
            const {image, title} = selection;
            return {
                title: title || "Custom Image",
                media: image,
                subtitle: "Custom Image",
            };
        },
    }
})
