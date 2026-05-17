import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import { customImage } from './objects/customImage'
import homeTesla from './objects/homeTesla'
import homeIntro from './objects/homeIntro'
import homeFleet from './objects/homeFleet'
import scrollContent from './objects/scrollContent'
import richTextTitle from './objects/richTextTitle'
import imageRichText from './objects/imageRichText'
import richText from './objects/richText'
import homeCta from './objects/homeCta'
import { homeHeroSlider } from './objects/homeHeroSlider'
import { homeWorkFlow } from './objects/homeWorkFlow'
import { faq } from './documents/faq'
import {termsAndConditionSection} from './objects/termsAndConditionSection'
import { testimonials } from './documents/testimonials'
import { localeBlockContent } from './utils/localeBlockContent'
import { localeString } from './utils/localeString'
import { localeText } from './utils/localeText'
import carServicesList from './objects/carServicesList'
import logoList from './objects/logoList'
import testimonial from './objects/testimonial'
import faqSection from './objects/faqSection'
import serviceListing from './objects/serviceListing'
import { linkList } from './objects/linkList'
import { linkItem } from './objects/linkItem'
import { fragment } from './documents/fragement/fragment'
import { header } from './documents/fragement/header'
import { footer } from './documents/fragement/footer'
import {offer} from './documents/offer'
import serviceBooked from './objects/serviceBooked'
import  serviceCart  from './objects/serviceCart'
import  serviceBookedTesla  from './objects/serviceBookedTesla'
import  location  from './objects/location'
import { service } from './documents/service'
import serviceCard from './objects/serviceCard'
import { contactUsForm } from './objects/contactUs'
import { extendedWarrantyForm } from './objects/extendedWarrantyForm'
import { fleetManagementForm } from './objects/fleetManagement'
import { teslaForm } from './objects/teslaForm'
import { blog } from './documents/blog'
import blogImage from './objects/blogImage'
import { homeBlog } from './objects/homeBlog'



// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  post,
  person,
  faq,
  testimonials,
  fragment,
  header,
  footer,
  offer,
  service,
  blog,

  // Objects
  blockContent,
  infoSection,
  callToAction,
  link,
  homeTesla,
  homeIntro,
  homeFleet,
  scrollContent,
  richText,
  imageRichText,
  homeCta,
  richTextTitle,
  homeHeroSlider,
  homeWorkFlow,
  termsAndConditionSection,
  localeBlockContent,
  customImage,
  localeString,
  localeText,
  carServicesList,
  logoList,
  testimonial,
  faqSection,
  serviceListing,
  linkList,
  linkItem,
  serviceBooked,
  serviceBookedTesla,
  serviceCart,
  location, 
  serviceCard,
  extendedWarrantyForm,
  contactUsForm,
  fleetManagementForm,
  teslaForm,
  blogImage,
  homeBlog,
]
