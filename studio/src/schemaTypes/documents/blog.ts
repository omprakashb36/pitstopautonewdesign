import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { i18n } from "../../../language";
import { de } from "date-fns/locale";

export const blog = defineType({
    name: 'blog',
    title: 'Blog',
    type: 'document',
    icon: DocumentIcon,
    fields: [
        defineField({
            name: 'IsHomePage',
            type: 'boolean',
            title: 'Is Featured Blog',
            description: 'Check this if the blog is featured on the home page',
            initialValue: false,
        }),
        defineField({
            name: 'categoryTags',
            type: 'tags',
            options: {
                includeFromRelated: 'categoryTags',
            },
            title: 'Category Tags',
            description: 'Add category tags for the blog',
        }),
        defineField({
            name: 'title',
            type: 'string',
            title: 'Title',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            validation: (Rule) => Rule.required(),
            options: {
                source: 'title',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'shortDescription',
            type: 'text',
            title: 'Short Description',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'blogDate',
            type: 'date',
            title: 'Blog Date',
        }),
        defineField({
            name: 'thumbnailImage',
            type: 'customImage',
            title: 'Thumbnail Image',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'blogImage',
            type: 'customImage',
            title: 'Blog Image',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'pageBuilder',
            title: 'Page builder',
            type: 'array',
            of: [{type:'richText'},{type:'blogImage'}],

            options: {
                insertMenu: {
                    // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
                    views: [
                        {
                            name: 'grid',
                            previewImageUrl: (schemaTypeName) =>
                                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
                        },
                    ],
                },
            },
        }),
        defineField({
            name: 'language',
            title: 'Language',
            type: 'string',
            options: {
                list: i18n.languages.map((l) => l.id),
                layout: 'dropdown',
            },
            readOnly: true,
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'thumbnailImage.image',
            subtitle: 'blogDate',
        }
    }
})