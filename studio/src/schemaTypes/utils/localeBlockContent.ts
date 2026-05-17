import { defineField, defineType } from "sanity";
import { i18n } from "../../../language";

export const localeBlockContent = defineType({
    name: 'localeBlockContent',
    title: 'Localized Block Content',
    type: 'object',
    fields: [
        ...i18n.languages.map((lang) =>
            defineField({
                name: lang.id,
                title: lang.title,
                type: 'blockContent'
            })
        ),
    ],
});