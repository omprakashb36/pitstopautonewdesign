import { defineField, defineType } from "sanity";
import { i18n } from "../../../language";

export const localeString = defineType({
    name: 'localeString',
    title: 'Localized String',
    type: 'object',
    fields: [
        ...i18n.languages.map((lang) =>
            defineField({
                name: lang.id,
                title: lang.title,
                type: 'string'
            })
        ),
    ],
});