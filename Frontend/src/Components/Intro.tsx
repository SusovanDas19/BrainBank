import { motion } from "motion/react";
import all from "../assets/all.png";
import { Button } from "./UI/Button";
import { useNavigate } from "react-router-dom";
import { LuBrainCircuit, LuFileSearch } from "react-icons/lu";
import { BsTwitterX, BsLinkedin } from "react-icons/bs";
import { GrYoutube } from "react-icons/gr";
import { SiNotion, SiGooglegemini } from "react-icons/si";
import { VscGithubInverted } from "react-icons/vsc";
import { RiChatAiFill } from "react-icons/ri";
import { MdEditNote, MdDelete } from "react-icons/md";
import { IoIosAddCircle, IoMdPerson } from "react-icons/io";
import { IoShareSocialSharp } from "react-icons/io5";
import { HiSwitchHorizontal, HiUserGroup } from "react-icons/hi";

import { Box, IntroCard, IntroSubCard } from "./UI/IntroUI";
import { Footer } from "./Footer";
import { useMediaQuery } from "../customHooks/useMediaQuery";
export const Intro = () => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const initialX = isDesktop ? -270 : 1;
  const destinationX = isDesktop ? 210 : 180;

  const repeatingTransition = {
    duration: 5,
    repeat: Infinity,
    type: "spring" as const, 
  };

  const animatedIcons = [
    { Icon: BsTwitterX, y: -195, className: "text-xl" },
    { Icon: GrYoutube, y: -250, className: "text-2xl" },
    { Icon: BsLinkedin, y: -310, className: "text-xl" },
    { Icon: SiNotion, y: -380, className: "text-xl" },
    { Icon: VscGithubInverted, y: -470, className: "text-xl" },
    { Icon: RiChatAiFill, y: -550, className: "text-xl" },
    { Icon: MdEditNote, y: -620, className: "text-2xl" },
  ];
  return (
    <div className="min-h-screen w-full flex flex-col font-primary justify-center items-center text-black dark:text-white dark:bg-primaryBlack bg-white">
      <h1 className="text-4xl md:text-6xl mb-10 md:mb-30 flex flex-row gap-2 mt-10">
        <motion.span
          initial={{ filter: "blur(10px)", scale: 0.8, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            ease: ["easeIn", "easeOut"],
            duration: 1,
          }}
        >
          Welcome
        </motion.span>
        <motion.span
          initial={{ filter: "blur(10px)", scale: 0.8, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            ease: ["easeIn", "easeOut"],
            duration: 1,
            delay: 0.2,
          }}
        >
          to
        </motion.span>
        <motion.span
          initial={{ filter: "blur(10px)", scale: 0.8, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            ease: ["easeIn", "easeOut"],
            duration: 1,
            delay: 0.3,
          }}
        >
          BrainBank
        </motion.span>
      </h1>
      <div className="flex flex-col md:flex-row gap-8 mb-20">
        <div className="flex flex-col justify-center items-center gap-5">
          <h1 className=" text-2xl md:text-4xl">
            Never lose a importannt <strong>link</strong> again☺️
          </h1>
          <p className="font-Ai text-center text-gray-600 dark:text-gray-400 font-light mb-10">
            Your all-in-one link Bank 😎 - Organize, share, and explore links
            and browser tabs effortlessly.
            <br /> Store the important link in your
            <strong className="text-whiteOrange dark:text-blackOrange ml-1">
              BrainBank
            </strong>
          </p>
          <Button
            variant="primary"
            size="md"
            text="Explore BrainBank"
            onClick={() => {
              navigate("/auth");
            }}
          />
        </div>
        <motion.span
          initial={{ filter: "blur(10px)", scale: 0.8, opacity: 0 }}
          animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            ease: ["easeIn", "easeOut"],
            duration: 2,
            delay: 0.5,
          }}
        >
          <img
            src={all}
            alt=""
            className="ml-8 w-80 md:w-[480px] h-80 md:h-96 rounded shadow-xl shadow-gray-400 dark:shadow-gray-400/60 ring-1"
          />
        </motion.span>
      </div>

      <div id="features" className="flex flex-col justify-center items-center gap-15">
        <h1 className="text-4xl">Our Features</h1>
        <div className="flex flex-col md:flex-row gap-10">
          <IntroCard variant="1">
            <div className="h-full flex flex-col justify-center ">
              <p className="text-2xl mb-7 font-semibold">
                Add your links in <br />
                various catagories
              </p>
              <Box variant="parent">
                <motion.div className="flex">
                  <LuBrainCircuit className="text-3xl" />
                </motion.div>
              </Box>

              <p className="text-md font-medium dark:text-gray-200">
                Organize your links in popular {!isDesktop && <br/>}catagories like Youtube, <br />
                Linedin, X, GitHub,
              </p>
            </div>

            <div className="w-1/2 md:w-full flex flex-col justify-center items-center gap-5 text-gray-800 dark:text-white">
               {animatedIcons.map(({ Icon, y, className }, index) => (
                <motion.div
                  key={index}
                  initial={{ x: initialX, y: y, opacity: 0, scale: 0.5 }}
                  animate={{ x: destinationX, y: -470, opacity: 1, scale: 1 }}
                  transition={repeatingTransition}
                >
                  <Box variant="child">
                    <Icon className={className} />
                  </Box>
                </motion.div>
              ))}
            </div>
          </IntroCard>
          <IntroCard variant="2">
            <div className="flex flex-col gap-8 justify-center items-center dark:text-white ">
              <h1 className="text-2xl font-semibold">Manage Your BrainBank</h1>

              <IntroSubCard variant="1">
                <div className="dark:text-gray-50/80">
                  Use your Brain Bank links to complete a range of tasks!
                </div>
                <div className="flex flex-row gap-7 justify-center items-center">
                  <div className="flex justify-center items-center flex-col">
                    <Box variant="manage">
                      <IoIosAddCircle className="text-xl text-green-500" />
                    </Box>
                    <p className="font-semibold text-lg">Add</p>
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    <Box variant="manage">
                      <LuFileSearch className="text-xl text-yellow-500" />
                    </Box>
                    <p className="font-semibold text-lg">Explore</p>
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    <Box variant="manage">
                      <MdDelete className="text-xl text-red-500" />
                    </Box>
                    <p className="font-semibold text-lg">Delete</p>
                  </div>
                </div>
              </IntroSubCard>

              <IntroSubCard variant="1">
                <ul className="list-disc marker:text-orange-500 list-inside space-y-1 text-md font-stretch-expanded">
                  <li>Quickly access your recently added data.</li>
                  <li>Effortlessly manage category links using the sidebar.</li>
                </ul>
              </IntroSubCard>
              <IntroSubCard variant="1">
                <ul className="list-[square] marker:text-orange-500 list-inside space-y-1 text-md font-stretch-expanded">
                  <li>
                    Instantly find your links using our fast and precise
                    <strong className="text-whiteOrange dark:text-blackOrange"> "AI-powered"</strong> search.
                  </li>
                </ul>
              </IntroSubCard>
            </div>
          </IntroCard>
        </div>
        <div id="colab"></div>
        <div className="w-full flex flex-col gap-20">
          <IntroCard variant="3">
            <div  className="h-full w-full flex flex-col md:flex-row gap-5 justify-center items-center dark:text-white">
              <IntroSubCard variant="2">
                <div className="flex flex-col justify-center items-center gap-3 p-2">
                  <h1 className="text-2xl font-semibold">
                    Work Together Smarter
                  </h1>
                  <div className="flex flex-row gap-5 justify-center items-center">
                    <motion.div
                      className="flex justify-center items-center flex-col gap-1"
                      initial={{ x: 0, y: 0 }}
                      animate={{ x: 128, y: 0 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "mirror",
                        repeatDelay: 2,
                      }}
                    >
                      <Box variant="manage">
                        <IoMdPerson className="text-2xl text-cyan-400" />
                      </Box>
                      <p>Personal</p>
                    </motion.div>
                    <div className="mb-5 ml-2 text-2xl text-blue-600">
                      <HiSwitchHorizontal />
                    </div>
                    <motion.div
                      className="flex justify-center items-center flex-col gap-1"
                      initial={{ x: 0, y: 0 }}
                      animate={{ x: -128, y: 0 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "mirror",
                        repeatDelay: 2,
                      }}
                    >
                      <Box variant="manage">
                        <HiUserGroup className="text-2xl text-rose-600" />
                      </Box>
                      <p>Organization</p>
                    </motion.div>
                  </div>
                  <p className="dark:text-gray-50/80 text-gray-700 font-semibold">
                    Seamlessly switch between your personal and organization
                    account.
                  </p>
                </div>
              </IntroSubCard>
              <IntroSubCard variant="2">
                <div className="flex justify-center items-center flex-col gap-5">
                  <h1 className="text-2xl font-semibold mb-5">
                    Share your BrainBank
                  </h1>
                  <div className="flex justify-center items-center flex-row gap-5 px-5">
                    <ul className="flex-3 list-disc marker:text-orange-500 list-inside space-y-1 text-md font-stretch-expanded">
                      <li>
                        Generate your BrainBank link and share it with anyone to
                        allow view-only access to your contents.
                      </li>
                      <li>Take access any time</li>
                    </ul>

                    <div className="flex-1 text-3xl text-blue-800">
                      <Box variant="manage">
                        <IoShareSocialSharp />
                      </Box>
                    </div>
                  </div>
                </div>
              </IntroSubCard>
            </div>
          </IntroCard>

          <IntroCard variant="3">
            <div id="aiFeatures" className="w-full h-full flex justify-center items-center gap-5 flex-col">
              <h1 className="text-2xl font-semibold">AI Features</h1>
              <div className="w-full h-full flex justify-center items-center gap-5 flex-col md:flex-row">
                <IntroSubCard variant="1">
                  <div className="flex-1 h-full">
                    <div className="flex flex-row gap-5">
                      <p className="flex flex-2 font-semibold">
                        <SiGooglegemini className="text-4xl text-[#468bd5] " />
                        Explore YouTube BrainBank links and get "AI-powered"
                        insights without even watching the video.
                      </p>

                      <Box variant="child">
                        <GrYoutube className="text-2xl text-red-600" />
                      </Box>
                    </div>
                  </div>
                </IntroSubCard>
                <IntroSubCard variant="1">
                  <div className="flex-1 h-full">
                    <div className="flex flex-row gap-5">
                      <p className="flex flex-2 font-semibold">
                        <SiGooglegemini className="text-4xl text-[#468bd5]" />
                        Discover the sentiment of each Twitter post in your
                        BrainBank—positive, negative, or neutral—using
                        generative AI.
                      </p>

                      <Box variant="child">
                        <BsTwitterX className="text-2xl text-white" />
                      </Box>
                    </div>
                  </div>
                </IntroSubCard>
              </div>
            </div>
          </IntroCard>
        </div>
      </div>

      <div className="w-full h-full  mt-50">
        <Footer/>
      </div>
    </div>
  );
};
