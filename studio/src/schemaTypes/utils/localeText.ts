import { defineField, defineType } from "sanity";
import { i18n } from "../../../language";

export const localeText = defineType({
    name: 'localeText',
    title: 'Localized Text',
    type: 'object',
    fields: [
        ...i18n.languages.map((lang) =>
            defineField({
                name: lang.id,
                title: lang.title,
                type: 'text'
            })
        ),
    ],
});