import { defineField, defineType } from "sanity";

export const extendedWarrantyForm = defineType({
    name: "extendedWarrantyForm",
    title: "Extended Warranty Form",
    type: "object",
    fields: [
        // Section Heading: Personal Details
        defineField({
            name: "personalDetails",
            title: "Personal Details",
            type: "object",
            fields: [
                defineField({
                    name: "heading",
                    title: "Section Heading",
                    type: "string",
                    initialValue: "1. Personal details",
                }),
                defineField({
                    name: "firstname",
                    title: "First Name",
                    type: "object",
                    fields: [
                        defineField({
                            name: "label",
                            title: "Label",
                            type: "string",
                        }),
                        defineField({
                            name: "placeholder",
                            title: "Placeholder",
                            type: "string",
                        }),
                    ],
                    options: { columns: 2, collapsible: false },
                }),
                defineField({
                    name: "lastname",
                    title: "Last Name",
                    type: "object",
                    fields: [
                        defineField({
                            name: "label",
                            title: "Label",
                            type: "string",
                        }),
                        defineField({
                            name: "placeholder",
                            title: "Placeholder",
                            type: "string",
                        }),
                    ],
                    options: { columns: 2, collapsible: false },
                }),
                defineField({
                    name: "email",
                    title: "Email",
                    type: "object",
                    fields: [
                        defineField({
                            name: "label",
                            title: "Label",
                            type: "string",
                        }),
                        defineField({
                            name: "placeholder",
                            title: "Placeholder",
                            type: "string",
                        }),
                    ],
                    options: { columns: 2, collapsible: false },
                }),
                defineField({
                    name: "contact",
                    title: "Contact",
                    type: "object",
                    fields: [
                        defineField({
                            name:"country",
                            title: "Country",
                            type: "object",
                            fields: [
                                defineField({
                                    name: "label",
                                    title: "Label",
                                    type: "string",
                                }),
                                defineField({
                                    name: "placeholder",
                                    title: "Placeholder",
                                    type: "string",
                                }),
                            ],
                            options: { columns: 2, collapsible: false },
                        }),
                      
                        defineField({
                            name: "countryCode",
                            title: "Country Code",
                            type: "array",
                            of: [
                                {
                                    type: "number",
                                },
                            ],
                        }),
                        defineField({
                            name: "phone",
                            title: "Phone Number",
                            type: "object",
                            fields: [
                                defineField({
                                    name: "label",
                                    title: "Label",
                                    type: "string",
                                }),
                                defineField({
                                    name: "placeholder",
                                    title: "Placeholder",
                                    type: "string",
                                }),
                            ],
                            options: { columns: 2, collapsible: false },
                        }),
                    ],
                }),
            ]
        }),
        defineField({
            name: "vehicleDetails",
            title: "Vehicale Details",
            type: "object",
            fields: [
                defineField({
                    name: "heading",
                    title: "Section Heading",
                    type: "string",
                    initialValue: "2. Vehicle details",
                }),
                defineField({
                    name: "vin",
                    title: 'VIN',
                    type: "object",
                    readOnly: true,
                    deprecated: { reason: 'This field is deprecated and will be removed in future versions.' },
                    fields: [
                        defineField({
                            name: "label",
                            title: "Label",
                            type: "string",
                        }),
                        defineField({
                            name: "placeholder",
                            title: "Placeholder",
                            type: "string",
                        }),
                    ],
                    options: { columns: 2, collapsible: false },
                }),
                defineField({
                    name: "plateNumber",
                    title: 'Plate Number',
                    type: "object",
                    fields: [
                        defineField({
                            name: "label",
                            title: "Label",
                            type: "string",
                        }),
                        defineField({
                            name: "placeholder",
                            title: "Placeholder",
                            type: "string",
                        }),
                    ],
                    options: { columns: 2, collapsible: false },
                }),
                defineField({
                    name: "brand",
                    title: "Brand",
                    type: "object",
                    fields: [
                        defineField({
                            name: "labelPlaceholder",
                            title: "Label & Placeholder",
                            type: "object",
                            fields: [
                                defineField({
                                    name: "label",
                                    title: "Label",
                                    type: "string",
                                }),
                                defineField({
                                    name: "placeholder",
                                    title: "Placeholder",
                                    type: "string",
                                }),
                            ],
                            options: { columns: 2, collapsible: false },
                        }),
                    ],
                }),
                defineField({
                    name: "model",
                    title: "Model",
                    type: "object",
                    fields: [
                        defineField({
                            name: "labelPlaceholder",
                            title: "Label & Placeholder",
                            type: "object",
                            fields: [
                                defineField({
                                    name: "label",
                                    title: "Label",
                                    type: "string",
                                }),
                                defineField({
                                    name: "placeholder",
                                    title: "Placeholder",
                                    type: "string",
                                }),
                            ],
                            options: { columns: 2, collapsible: false },
                        }),
                       
                    ],
                }),
                defineField({
                    name: "year",
                    title: "Year",
                    type: "object",
                    fields: [
                        defineField({
                            name: "labelPlaceholder",
                            title: "Label & Placeholder",
                            type: "object",
                            fields: [
                                defineField({
                                    name: "label",
                                    title: "Label",
                                    type: "string",
                                }),
                                defineField({
                                    name: "placeholder",
                                    title: "Placeholder",
                                    type: "string",
                                }),
                            ],
                            options: { columns: 2, collapsible: false },
                        }),
                        defineField({
                            name: "years",
                            title: "Add Years",
                            type: "array",
                            of: [
                                {
                                    type: "number",
                                },
                            ],
                        }),
                    ],
                }),
                defineField({
                    name: "odometer",
                    title: "Current odometer reading (Km)",
                    type: "object",
                    fields: [
                        defineField({
                            name: "labelPlaceholder",
                            title: "Label & Placeholder",
                            type: "object",
                            fields: [
                                defineField({
                                    name: "label",
                                    title: "Label",
                                    type: "string",
                                }),
                                defineField({
                                    name: "placeholder",
                                    title: "Placeholder",
                                    type: "string",
                                }),
                            ],
                            options: { columns: 2 , collapsible: false },
                        }),
                    ],
                  options: { collapsible: false },
                }),
            ]
        }),
        defineField({
            name:"submitButton",
            title:"Submit Button",
            type:"callToAction",
        })
        // defineField({
        //     name: "warrantyDetails",
        //     title: "Warranty Details",
        //     type: "object",
        //     fields: [
        //         defineField({
        //             name: "heading",
        //             title: "Section Heading",
        //             type: "string",
        //             initialValue: "3.Warranty details",
        //         }),
        //         defineField({
        //             name: "warrantyDates",
        //             title: "Warranty Dates",
        //             type: "object",
        //             fields: [
        //                 defineField({
        //                     name: "startDate",
        //                     title: "Original Warranty Start Date",
        //                     type: "object",
        //                     fields: [
        //                         defineField({
        //                             name: "startLabel",
        //                             title: "Start Label",
        //                             type: "string",
        //                         }),
        //                         defineField({
        //                             name: "types",
        //                             title: "Add Types",
        //                             type: "date",
        //                         }),
        //                     ],

        //                 }),
        //                 defineField({
        //                     name: "endDate",
        //                     title: "Original Warranty Start Date",
        //                     type: "object",
        //                     fields: [
        //                         defineField({
        //                             name: "endLabel",
        //                             title: "End Label",
        //                             type: "string",
        //                         }),
        //                         defineField({
        //                             name: "placeholder",
        //                             title: "Placeholder",
        //                             type: "date",
        //                         }),
        //                     ],

        //                 }),
        //             ],
        //             options: { columns: 2 },
        //         }),

        //          defineField({
        //              name: "hasWarranty",
        //              title: "Has Extended Warranty?",
        //              type: "object",
        //              fields: [
        //                  defineField({
        //                      name: "labelPlaceholder",
        //                      title: "Label & Placeholder",
        //                      type: "object",
        //                      fields: [
        //                          defineField({
        //                              name: "label",
        //                              title: "Label",
        //                              type: "string",
        //                         }),
        //                          defineField({
        //                              name: "placeholder",
        //                              title: "Placeholder",
        //                              type: "string",
        //                          }),
        //                      ],
        //                      options: { columns: 2 },
        //                  }),
        //                  defineField({
        //                      name: "option",
        //                      title: "Option",
        //                      type: "string",
        //                      options: {
        //                          list: [
        //                              { title: "Yes", value: "yes" },
        //                              { title: "No", value: "no" }
        //                          ],
        //                          layout: "radio"
        //                      }
        //                  }),
        //              ],
        //          })
        //     ]
        // }),
    ],
    preview: {
        select: {
            title: "personalDetails.heading",
            
        },
        prepare(selection) {
            const { title } = selection;
            return {
                title: title || "Extended Warranty Form",
                subtitle: "Extended Warranty Form",
            };
        },
    },
});
