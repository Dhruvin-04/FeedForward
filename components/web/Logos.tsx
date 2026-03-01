export default function NgoLogos() {
    const companyLogos = ["Akshaya Patra Foundation", "Feeding India", "Robin Hood Army", "Annamrita Foundation", "No Food Waste", "Annaporna Trust", "Roti Bank"];

    return (
        <>
            <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }

                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>

            <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none">
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-white to-transparent" />
                <div className="marquee-inner flex will-change-transform min-w-[200%]" style={{ animationDuration: "60s" }}>
                    <div className="flex items-center justify-center w-full h-full gap-7">
                        <img src='https://give.do/static/img/logos/17JU/ae0c8fb5-cbb8-4359-8ac8-9b58adfaa833.webp'
                            alt="img" className="w-40 h-full object-cover mx-6" draggable={false} />
                        <img src='	https://www.feedingindia.org/_next/static/media/logo.99c00840.svg'
                            alt="img" className="w-40 h-full object-cover mx-6" draggable={false} />
                        <img src='https://process.filestackapi.com/Ar1JhJgKrRMCHY5XInB1Iz/output=f:jpg/cache=expiry:max/https://cdn.filepicker.io/api/file/wtteHtRtRFWcQK5C6ZsY'
                            alt="img" className="w-40 h-full object-cover mx-6" draggable={false} />
                        <img src='https://give.do/static/img/logos/KNX/739e072c-6e14-423c-9187-df2df3b3d28a.png'
                            alt="img" className="w-40 h-full object-cover mx-6" draggable={false} />
                        <img src='https://nofoodwastechennai.ngo/wp-content/uploads/2025/11/logo.png'
                            alt="img" className="w-40 h-full object-cover mx-6" draggable={false} />
                        <img src='https://annapoorna.org.in/wp-content/uploads/2024/05/AnnapoornaNewLogo-768x940-1.jpeg'
                            alt="img" className="w-40 h-full object-cover mx-6" draggable={false} />
                        <img src='https://rotibankfoundation.org/wp-content/uploads/2024/11/Header-logo.webp'
                            alt="img" className="w-40 h-full object-cover mx-6" draggable={false} />
                    </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white to-transparent" />
            </div>
        </>
    );
};