import { defineField, defineType } from "sanity";

export default defineType({
  name: 'location',
  title: 'Location Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'subHeading',
      title: 'Sub Heading',
      type: 'string',
    }),
    defineField({
      name: 'directionsButtonLabel',
      title: 'Get Directions Button Label',
      type: 'string',
    }),
    defineField({
      name: 'mobileButton',
      title: 'Mobile Our Locations Label',
      type: 'string',
    }),
     defineField({
  name: 'showFilters',
  title: 'Show Filters',
  type: 'boolean',
  description: 'Toggle to show or hide filters on the frontend.',
  initialValue: true, // optional, defaults to true
}),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'mapId',
              title: 'Map Tag',
              type: 'string',
            },
            {
              name: 'title',
              title: 'Location Title',
              type: 'string',
            },
            {
              name: 'serviceName',
              title: 'Service Title',
              type: 'string',
            },
            {
              name: 'poptitle',
              title: 'Popup Title',
              type: 'string',
            },
            {
              name: 'phoneNo',
              title: 'Phone No',
              type: 'string',
            },
            {
              name: 'address',
              title: 'Address',
              type: 'blockContent',
            },
            {
              name: 'timingLabel1',
              title: 'Timing Label1 (Sun - Thu)',
              type: 'string',
            },
            {
              name: 'workingHours',
              title: 'Timing Hours',
              type: 'string',
            },
            {
              name: 'fridayTiming',
              title: 'Friday Timing',
              type: 'object',
              fields: [
                {
                  name: 'fridayTimingLabel',
                  title: 'Friday Timing Label',
                  type: 'string',
                },
                {
                  name: 'morning',
                  title: 'Morning Time',
                  type: 'string',
                },
                {
                  name: 'evening',
                  title: 'Evening Time',
                  type: 'string',
                },
              ],
            },
            {
              name: 'timingLabel3',
              title: 'Saturday Timing Label',
              type: 'string',
            },
            {
              name: 'saturdayTime',
              title: 'Saturday Hours',
              type: 'string',
            },
            {
              name: 'mapUrl',
              title: 'Map URL',
              type: 'url',
            },
            {
              name: 'coordinates',
              title: 'Coordinates',
              type: 'object',
              fields: [
                {
                  name: 'x',
                  title: 'X Percentage Coordinates',
                  type: 'number',
                },
                {
                  name: 'y',
                  title: 'Y Percentage Coordinates',
                  type: 'number',
                },
              ],
            },

            // Added: Select related service(s)
            defineField({
              name: 'relatedServices',
              title: 'Select Related Services',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'service' }],
                },
              ],
              description: 'Select one or more services offered at this location.',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'address',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({ title }) {
      return {
        title: title || 'Location Section',
        subtitle: 'Location Section',
      };
    },
  },
});
