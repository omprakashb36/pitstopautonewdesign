"use client";
import ImageGallery from '@/app/components/common/image-gallery'
import useDeviceDetection from '@/app/hooks/useDeviceDetection';
import { Blog } from '@/sanity.types'
import Link from 'next/link';

type BlogDetailProp = {
    blogDetail: Blog
}
function BlogDetail({ blogDetail }: BlogDetailProp) {
    console.log("blogDetail", blogDetail);
    const { isMobileDevice, currentLocale } = useDeviceDetection()
    return (
        <div className="dark:text-[#FAEADC] text-black mt-[180px] min-h-screen pageBg">
            <div className='container'>
                <div className="flex items-center gap-2 text-[15px] mb-6">
                    <Link href={`/${currentLocale}`}>Home</Link>
                    <span>/</span>
                    <Link href={`/${currentLocale}/blog`}>Blog</Link>
                    <span>/</span>
                    <span className="opacity-60">Blog details</span>
                </div>
                <h2 className='semibold text-[60px] leading-[100%] uppercase  font-shoulders'>Inside the Heart of Auto Care: A Look at Your Local Car Workshop</h2>
                <img className='w-full max-h-[550px] block mt-[60px]' src="/images/blogbanner.png" alt="" />
                <div className="space-y-6 px-3 xl:px-10 3xl:px-[140px] mt-6">
                    <div className="flex items-center gap-4 text-sm">
                        <time className="text-xs font-bold">August 24, 2025</time>
                        <span className="text-muted-foreground">
                            /<span className="text-xs font-bold ml-1">category</span>
                        </span>
                    </div>
                    <p className='text-[22px] urbanist'>In today's fast-paced world, our vehicles are more than just modes of transportation—they're essential partners in our daily lives. Behind the scenes, keeping them running smoothly is the dedicated work of car workshops. These bustling hubs of automotive expertise blend skill, technology, and precision to ensure your car performs at its best. Whether it's a routine check-up or a major repair, a good car workshop is the unsung hero of road safety and reliability.</p>
                    <ImageGallery
                        images={[
                            { src: "/images/glry.png", alt: "Car maintenance" },
                            { src: "/images/glry1.png", alt: "Vehicle inspection" },
                            { src: "/images/glry2.png", alt: "Winter maintenance" },
                        ]}
                    />
                    <h3 className='text-[40px] font-extrabold font-urbanist leading-[100%]'>Well-organized space filled with specialized tools and equipment</h3>
                    <p className='text-[22px] urbanist'>One of the most common services offered is routine maintenance, which helps prevent bigger issues down the road. This includes oil changes, tire rotations, and brake inspections. Regular visits to a workshop can extend your car's lifespan and improve fuel efficiency. For more complex repairs, workshops handle everything from engine overhauls to transmission work. Skilled technicians use their experience to diagnose issues accurately, often relying on advanced scanning tools to pinpoint faults in modern vehicles loaded with electronics.</p>
                    <h3 className='text-[40px] font-extrabold font-urbanist leading-[100%]'>Routine maintenance</h3>
                    <p className='text-[22px] urbanist'>One of the most common services offered is routine maintenance, which helps prevent bigger issues down the road. This includes oil changes, tire rotations, and brake inspections. Regular visits to a workshop can extend your car's lifespan and improve fuel efficiency. For more complex repairs, workshops handle everything from engine overhauls to transmission work. Skilled technicians use their experience to diagnose issues accurately, often relying on advanced scanning tools to pinpoint faults in modern vehicles loaded with electronics.</p>
                    <ImageGallery
                        images={[
                            { src: "/images/glry3.png", alt: "Car maintenance" },
                            { src: "/images/glry4.png", alt: "Vehicle inspection" },
                        ]}
                    />
                    <ImageGallery
                        images={[
                            { src: "/images/glry5.png", alt: "Car maintenance" },
                        ]}
                    />
                    <h3 className='text-[40px] font-extrabold font-urbanist leading-[100%]'>Choosing the right car workshop can make all the difference</h3>
                    <p className='text-[22px] urbanist'>Skilled technicians use their experience to diagnose issues accurately, often relying on advanced scanning tools to pinpoint faults in modern vehicles loaded with electronics.</p>
                    <ul>
                        <li className='flex'><strong>Certifications and Expertise</strong>: Look for mechanics certified by recognized bodies, ensuring they have up-to-date training on various vehicle makes and models..</li>
                        <li><strong>Customer Reviews</strong>: Online feedback from previous clients can reveal the workshop's reliability and service quality.</li>
                        <li><strong>Transparency</strong>: A good shop provides clear estimates, explains repairs in simple terms, and shows you faulty parts if needed.</li>
                        <li><strong>Warranty on Work</strong>: Reputable workshops offer guarantees on parts and labor, giving you peace of mind.
                        </li>
                    </ul>
                    <p className='text-[22px] urbanist'>Ultimately, a car workshop is more than a repair shop—it's a place where trust is built between vehicle owners and professionals committed to safety. By partnering with a reliable one, you not only keep your car in top condition but also contribute to safer roads for everyone. Next time your dashboard lights up or it's time for service, remember the skilled hands working behind the garage doors to get you back on the road confidently.</p>
                </div>
            </div>
        </div>
    )
}

export default BlogDetail
