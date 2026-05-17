import { defineField, defineType } from "sanity";

export default defineType({
    name: 'serviceCart',
    title : 'Service Cart',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'subHeading',
            title: 'Sub Title',
            type: 'string',
        }),
         defineField({
            name:"serviceTitle",
            title: 'Service Breadcrumbs Title',
            type: 'string',
        }),
        defineField({
            name: 'browseServiceLabel',
            title: 'Browse Service Label',
            type: 'string'
        }),
        defineField({
            name:"chengeLabel",
            title: 'Change Label',
            type: 'string',
        }),
        defineField({
            name: 'verifySection',
            title: 'Verify Section',
            type:'array',
            of:[
                defineField({
                    name:'verify',
                    type:'object',
                    title: 'Verify',
                    fields: [
                        defineField({
                            name: 'verify',
                            type: 'string',
                            title: 'Heading'
                        }),
                        defineField({
                            name:'countryLabel',
                            title: 'Country Label',
                            type:'string'
                        }),
                        defineField({
                            name:'otpLabel',
                            title: 'OTP Label',
                            type:'string'
                        }),
                        defineField({
                            name:'verifyBtnLabel',
                            title: 'Verify Button Label',
                            type:'string'
                        })
                        ,
                        defineField({
                            name:'sendOtpButtonLabel',
                            title: 'Send OTP Button Label',
                            type:'string'
                        }),
                        defineField({
                            name:'sendOtpLabel',
                            title: 'Resend OTP Label',
                            type:'string'
                        }),
                        defineField({
                            name:'editBtnLabel',
                            title: 'Edit Button Label',
                            type:'string'
                        })

                    ]
                })
            ]
        }),
        defineField({
            name: 'appointmentSection',
            title: 'Appointment Section',
            type:'array',
            of:[
                defineField({
                    name:'appointment',
                    type:'object',
                    title: 'Appointment',
                    fields: [
                        defineField({
                            name: 'appointment',
                            type: 'string',
                            title: 'Appointment'
                        }),
                        defineField({
                            name:'selectWorkShopLabel',
                            title: 'Workshop Label',
                            type:'string'
                        }),
                        defineField({
                            name:'workshopPlaceholder',
                            title: 'Workshop Placeholder',
                            type:'string'
                        }),
                        defineField({
                            name:'availableTimeSlotLabel',
                            title: 'select the available time slot Label',
                            type:'string'
                        }),
                        defineField({
                            name:'timeSlotLabel',
                            title: 'Time Slot Label',
                            type:'string'
                        }),
                        defineField({
                            name:'continueBtnLabel',
                            title: 'Continue Button Label',
                            type:'string'
                        }),
                        defineField({
                            name:'editBtnLabel',
                            title: 'Edit Button Label',
                            type:'string'
                        })
                    ]
                })
            ]
        }),
        defineField({
            name: 'personalDetailsSection',
            title: 'Personal Details Section',
            type:'array',
            of:[
                defineField({
                    name:'personalDetails',
                    type:'object',
                    title: 'Personal Details',
                    fields: [
                        defineField({
                            name: 'appointment',
                            type: 'string',
                            title: 'Appointment'
                        }),
                        defineField({
                            name:'fullNameLabel',
                            title: 'Full Name Label',
                            type:'string'
                        }),
                        defineField({
                            name:'emailLabel',
                            title: 'Email Label',
                            type:'string'
                        }),
                        defineField({
                            name:'verifyYourNameLabel',
                            title: 'verify your name and email to continue Label',
                            type:'string'
                        }),
                        defineField({
                            name:'declaration',
                            title: 'Declaration',
                            type:'string'
                        }),
                        defineField({
                            name:'continueBtnLabel',
                            title: 'Continue Button Label',
                            type:'string'
                        }),
                        defineField({
                            name:'editBtnLabel',
                            title: 'Edit Button Label',
                            type:'string'
                        })
                    ]
                })
            ]
        }),
        defineField({
            name: 'cartSection',
            title: 'Cart Section',
            type:'array',
            of:[
                defineField({
                    name:'cart',
                    type:'object',
                    title: 'Cart',
                    fields: [
                        defineField({
                            name: 'heading',
                            type: 'string',
                            title: 'Heading'
                        }),
                        defineField({
                            name:'scheduleLabel',
                            title: 'Schdule Label',
                            type:'string'
                        }),
                        defineField({
                            name:'emptyCartHeading',
                            title: 'Empty cart Heading',
                            type:'string'
                        }),
                        defineField({
                            name:'emptyCartSubHeading',
                            title: 'Empty cart Sub Heading',
                            type:'string'
                        }),
                        defineField({
                            name:'emptyCartImage',
                            title: 'Empty Cart Image',
                            type:'customImage'
                        }),
                        defineField({
                            name:'submittedBntLable',
                            title:'Submitted Lable',
                            type:'string'
                        })
                        
                    ]
                })
            ]
        }),

    ],
    preview: {
        select: {
            title: 'heading',
        },
        prepare({ title }) {
            return {
                title: title || 'Service Cart Section',
                subtitle: 'Service Cart Section',
            };
        },
    },
});