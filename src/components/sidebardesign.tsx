"use client";
import React from "react";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
// import logo from "@/images/logo";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Image from "next/image";
interface SidebarDesignProps {
  contentbg?: string;
  contentfill?: string;
  contenttext?: string;
  userbg?: string;
  userfill?: string;
  usertext?: string;
  livesessionbg?: string;
  sessionfill?: string;
  livesessiontext?: string;
  specialclassfill?: string;
  subsciptiontext?: string;
  content1bg?: string;
  content1text?: string;
  content2bg?: string;
  content2text?: string;
  achivementfill?: string;
  achivementtext?: string;
  achivementbg?: string;
  subscriptionbg?: string;
  subscriptionfill?: string;
  subscriptiontext?: string;
  subscription1bg?: string;
  subscription1text?: string;
  subscription2bg?: string;
  subscription2text?: string;
  specialclassbg?: string;
  specialclasstext?: string;
  querybg?: string;
  queryfill?: string;
  querytext?: string;
  videobg?: string;
  videofill?: string;
  videotext?: string;
  newsbg?: string;
  newsletterfill?: string;
  newslettertext?: string;
  news1bg?: string;
  newsletter1text?: string;
  news2bg?: string;
  newsletter2text?: string;
}

const SidebarDesign = (props: SidebarDesignProps) => {
  const [open, setOpen] = React.useState(0);

  const commonProps = {
    onPointerEnterCapture: () => {}, // Placeholder function
    onPointerLeaveCapture: () => {}, // Placeholder function
  };

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  const router = useRouter();

  return (
    <>
      <Card
        {...commonProps}
        placeholder="Your placeholder text here"
        className="z-50 border-r   border-b border-neutral-700 absolute rounded-none overflow-visible rounded-r-sm justify-start pb-[100px] w-[266px] bg-neutral-950   color-white m-0 p-2 peer-checked:hidden transition ease-in-out delay-150 duration-300"
      >
        <div className=" p-3 text-center overflow-visible flex items-center gap-2 content-center justify-center">
          <Image
            width={200}
            height={200}
            className="w-12 h-12 relative rounded-[50%] shrink-0 object-cover  "
            src='/logo.svg'
            alt=""
            color="blue"
          />
          <Typography
            {...commonProps}
            placeholder=""
            variant="h2"
            color="white"
          >
            <span className="text-[28px] text-nowrap"> FitnEarnPal</span>
          </Typography>
        </div>
        <List
          {...commonProps}
          placeholder=""
          className="overflow-visible gap-2"
        >
          <Accordion {...commonProps} placeholder="" open={open === 1}>
            <ListItem {...commonProps} placeholder="" className="p-0">
              <AccordionHeader
                {...commonProps}
                style={{ backgroundColor: props.userbg }}
                placeholder=""
                onClick={() => {
                  router.push("/usermanage/usertable");
                }}
                className={`border-b-0 p-3   rounded-lg`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M13 9V3H21V9H13ZM3 13V3H11V13H3ZM13 21V11H21V21H13ZM3 21V15H11V21H3Z"
                    fill="#FAFAFA"
                  />
                </svg>
                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`mr-[70px] text-${
                    props.usertext || "white"
                  } font-normal `}
                >
                  Dashboard
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Accordion>
          <Accordion
            {...commonProps}
            placeholder=""
            open={open === 1}
            icon={
              <ChevronDownIcon
                {...commonProps}
                strokeWidth={2.5}
                color="white"
                className={`mx-auto color-white  h-4 w-4 transition-transform ${
                  open === 1 ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem
              {...commonProps}
              placeholder=""
              className="p-0"
              selected={open === 1}
            >
              <AccordionHeader
                {...commonProps}
                placeholder=""
                style={{ backgroundColor: props.contentbg }}
                onClick={() => handleOpen(1)}
                className={`border-b-0 p-3 rounded-lg`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 11.4737C14.6765 11.4737 16.8462 9.35293 16.8462 6.73684C16.8462 4.12076 14.6765 2 12 2C9.32354 2 7.15385 4.12076 7.15385 6.73684C7.15385 9.35293 9.32354 11.4737 12 11.4737Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M13.6154 12.5263H10.3846C8.95705 12.528 7.58845 13.083 6.57901 14.0697C5.56957 15.0564 5.00171 16.3941 5 17.7895V20.9474C5 21.2265 5.11346 21.4943 5.31542 21.6917C5.51739 21.8891 5.79131 22 6.07692 22H17.9231C18.2087 22 18.4826 21.8891 18.6846 21.6917C18.8865 21.4943 19 21.2265 19 20.9474V17.7895C18.9983 16.3941 18.4304 15.0564 17.421 14.0697C16.4116 13.083 15.0429 12.528 13.6154 12.5263Z"
                    fill="#FAFAFA"
                  />
                </svg>

                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={` mr-[px] text-nowrap text-${
                    props.contenttext || "white"
                  } font-normal `}
                >
                  Coach Managment
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody {...commonProps} className="py-1">
              <List
                {...commonProps}
                placeholder=""
                className="p-0"
                color="white"
              >
                <ListItem
                  {...commonProps}
                  style={{ backgroundColor: props.content1bg }}
                  placeholder=""
                  className={`border-b-0 p-3  rounded-lg`}
                  color="white"
                >
                  <ListItemPrefix {...commonProps} placeholder="">
                    <ChevronRightIcon
                      {...commonProps}
                      strokeWidth={3}
                      color="white"
                      className="h-3 w-5"
                    />
                  </ListItemPrefix>
                  <span
                    onClick={() => {
                      router.push("/contentmanage/contenttable");
                    }}
                    className={`mr-auto text-${
                      props.content1text || "white"
                    } font-normal `}
                  >
                    Coach Management
                  </span>
                </ListItem>
                <ListItem
                  {...commonProps}
                  style={{ backgroundColor: props.content2bg }}
                  placeholder=""
                  className={`border-b-0 p-3 rounded-lg`}
                >
                  <ListItemPrefix {...commonProps} placeholder="">
                    <ChevronRightIcon
                      {...commonProps}
                      strokeWidth={3}
                      color="white"
                      className="h-3 w-5"
                    />
                  </ListItemPrefix>
                  <span
                    onClick={() => {
                      router.push("/contentmanage/contentplaylist");
                    }}
                    className={`mr-auto text-${
                      props.content2text || "white"
                    } font-normal `}
                  >
                    User Management
                  </span>
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
          <Accordion {...commonProps} placeholder="collapsed" open={open === 2}>
            <ListItem {...commonProps} placeholder="" className="p-0">
              <AccordionHeader
                {...commonProps}
                placeholder=""
                style={{ backgroundColor: props.livesessionbg }}
                className={`border-b-0 p-2 rounded-lg`}
                onClick={() => {
                  router.push("/liveSessionManagement");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clip-rule="evenodd"
                    d="M13.623 2.01297C13.4832 1.99108 13.3405 1.99695 13.2029 2.03023C13.0654 2.06351 12.9358 2.12355 12.8214 2.20694C12.7071 2.29032 12.6103 2.3954 12.5366 2.51619C12.4629 2.63698 12.4136 2.77111 12.3918 2.91091C12.3699 3.05072 12.3757 3.19347 12.409 3.33101C12.4423 3.46855 12.5023 3.59818 12.5857 3.71252C12.6691 3.82685 12.7742 3.92364 12.895 3.99736C13.0158 4.07108 13.1499 4.12029 13.2897 4.14218C15.2498 4.4578 17.0193 5.49939 18.2465 7.05992C19.4738 8.62045 20.0689 10.5856 19.9136 12.5648C19.7583 14.5441 18.8639 16.3924 17.4083 17.7424C15.9526 19.0924 14.0423 19.8452 12.057 19.8512C10.4726 19.8515 8.92466 19.3757 7.61401 18.4854C6.30336 17.5952 5.29048 16.3316 4.70677 14.8586C4.65775 14.723 4.58198 14.5985 4.48397 14.4927C4.38596 14.3869 4.26769 14.3018 4.13619 14.2425C4.00468 14.1832 3.86261 14.151 3.7184 14.1476C3.57419 14.1443 3.43078 14.1699 3.29666 14.223C3.16255 14.2761 3.04046 14.3556 2.93764 14.4568C2.83481 14.5579 2.75335 14.6787 2.69808 14.812C2.64281 14.9452 2.61485 15.0882 2.61587 15.2324C2.61688 15.3767 2.64685 15.5193 2.70399 15.6517C3.56712 17.8261 5.16107 19.6316 7.21161 20.7578C9.26215 21.8839 11.6411 22.2602 13.939 21.8218C16.237 21.3835 18.3104 20.158 19.8024 18.3561C21.2945 16.5542 22.1119 14.2887 22.114 11.9493C22.1139 9.55324 21.2586 7.23591 19.702 5.41435C18.1454 3.5928 15.9898 2.38664 13.623 2.01297ZM10.8559 2.84195C10.8913 2.97912 10.8993 3.12192 10.8795 3.26219C10.8597 3.40246 10.8124 3.53744 10.7403 3.65941C10.6682 3.78138 10.5728 3.88794 10.4596 3.973C10.3463 4.05805 10.2173 4.11994 10.0801 4.15511C9.72015 4.24772 9.36726 4.36583 9.0241 4.50854C8.89344 4.56288 8.75336 4.59095 8.61186 4.59115C8.47036 4.59135 8.3302 4.56368 8.19939 4.50971C8.06858 4.45575 7.94968 4.37655 7.84948 4.27663C7.74928 4.17672 7.66974 4.05804 7.6154 3.92739C7.56106 3.79673 7.53299 3.65665 7.53279 3.51515C7.53259 3.37365 7.56026 3.23349 7.61422 3.10268C7.66819 2.97187 7.74739 2.85297 7.84731 2.75277C7.94722 2.65257 8.0659 2.57303 8.19655 2.51869C8.63044 2.33766 9.08013 2.18681 9.54419 2.06756C9.68126 2.03236 9.82392 2.02451 9.96403 2.04445C10.1041 2.06439 10.2389 2.11174 10.3607 2.18378C10.4826 2.25582 10.589 2.35115 10.6739 2.46433C10.7589 2.57751 10.8207 2.70487 10.8559 2.84195ZM6.57594 4.61342C6.7747 4.81849 6.88393 5.09408 6.87962 5.37964C6.87531 5.66519 6.75782 5.93736 6.55295 6.13634C6.01874 6.65701 5.55939 7.24932 5.18807 7.89631C5.11977 8.02269 5.02689 8.13413 4.9149 8.22409C4.8029 8.31404 4.67405 8.3807 4.53592 8.42013C4.39779 8.45957 4.25316 8.47098 4.11056 8.45371C3.96795 8.43644 3.83023 8.39083 3.70551 8.31956C3.58079 8.24829 3.47157 8.1528 3.38429 8.0387C3.29701 7.92461 3.23342 7.79422 3.19727 7.65519C3.16111 7.51617 3.15312 7.37131 3.17376 7.22916C3.19441 7.087 3.24327 6.9504 3.31747 6.8274C3.78801 6.0039 4.37227 5.25084 5.05302 4.59043C5.25809 4.39166 5.53368 4.28244 5.81924 4.28675C6.10479 4.29106 6.37696 4.40855 6.57594 4.61342ZM3.31603 9.47814C3.59892 9.51802 3.8544 9.66861 4.02628 9.89681C4.19817 10.125 4.2724 10.4121 4.23265 10.695C4.18084 11.0639 4.15491 11.436 4.15507 11.8085C4.15507 12.0943 4.04155 12.3683 3.83947 12.5704C3.63739 12.7725 3.36332 12.886 3.07754 12.886C2.79176 12.886 2.51768 12.7725 2.3156 12.5704C2.11353 12.3683 2 12.0943 2 11.8085C2 11.3301 2.03304 10.8574 2.09913 10.3948C2.13902 10.1119 2.28961 9.85639 2.51781 9.68451C2.746 9.51262 3.03312 9.43839 3.31603 9.47814ZM8.46522 14.6532V9.24539C8.46535 9.00058 8.52803 8.75987 8.64731 8.5461C8.7666 8.33232 8.93852 8.15257 9.14679 8.0239C9.35505 7.89523 9.59273 7.82191 9.83729 7.81089C10.0818 7.79988 10.3252 7.85154 10.5441 7.96096L15.9519 10.6649C16.1903 10.7843 16.3907 10.9677 16.5307 11.1945C16.6707 11.4214 16.7449 11.6827 16.7449 11.9493C16.7449 12.2159 16.6707 12.4772 16.5307 12.704C16.3907 12.9309 16.1903 13.1143 15.9519 13.2337L10.5441 15.9376C10.3252 16.047 10.0818 16.0987 9.83729 16.0877C9.59273 16.0767 9.35505 16.0033 9.14679 15.8747C8.93852 15.746 8.7666 15.5662 8.64731 15.3525C8.52803 15.1387 8.46535 14.898 8.46522 14.6532Z"
                    fill="#FAFAFA"
                  />
                </svg>
                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`mr-auto text-nowrap text-${
                    props.livesessiontext || "white"
                  } mr-[0px] font-normal `}
                >
                  Session Management
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Accordion>
          <Accordion {...commonProps} placeholder="collapsed" open={open === 2}>
            <ListItem {...commonProps} placeholder="" className="p-0">
              <AccordionHeader
                {...commonProps}
                placeholder=""
                style={{ backgroundColor: props.livesessionbg }}
                className={`border-b-0 p-2  rounded-lg ml-2`}
                onClick={() => {
                  router.push("/sessionmanage/sessiontable");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M13 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H13C14.1046 19 15 18.1046 15 17V7C15 5.89543 14.1046 5 13 5Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M21.5 6.3C21.3485 6.21132 21.1763 6.16408 21.0008 6.16302C20.8253 6.16197 20.6525 6.20714 20.5 6.294L17 8.284V15.817L20.465 18.017C20.6166 18.113 20.7912 18.1664 20.9706 18.1717C21.15 18.177 21.3275 18.1339 21.4844 18.047C21.6414 17.9601 21.7721 17.8325 21.8628 17.6777C21.9535 17.5228 22.0009 17.3464 22 17.167V7.167C22.0002 6.9913 21.954 6.81865 21.8663 6.66645C21.7785 6.51424 21.6522 6.38785 21.5 6.3Z"
                    fill="#FAFAFA"
                  />
                </svg>
                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`mr-auto text-nowrap text-${
                    props.livesessiontext || "white"
                  } ml-[10px]  font-normal `}
                >
                  Workout Management
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Accordion>
          <Accordion {...commonProps} placeholder="collapsed" open={open === 2}>
            <ListItem {...commonProps} placeholder="" className="p-0">
              <AccordionHeader
                {...commonProps}
                placeholder=""
                style={{ backgroundColor: props.livesessionbg }}
                className={`border-b-0 p-2 rounded-lg ml-2`}
                onClick={() => {
                  router.push("/sessionmanage/sessiontable");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V19C2 19.5304 2.21071 20.0391 2.58579 20.4142C2.96086 20.7893 3.46957 21 4 21H20C20.5304 21 21.0391 20.7893 21.4142 20.4142C21.7893 20.0391 22 19.5304 22 19V5C22 4.46957 21.7893 3.96086 21.4142 3.58579C21.0391 3.21071 20.5304 3 20 3ZM14.5 7C14.7967 7 15.0867 7.08797 15.3334 7.2528C15.58 7.41762 15.7723 7.65189 15.8858 7.92597C15.9994 8.20006 16.0291 8.50166 15.9712 8.79264C15.9133 9.08361 15.7704 9.35088 15.5607 9.56066C15.3509 9.77044 15.0836 9.9133 14.7926 9.97118C14.5017 10.0291 14.2001 9.99935 13.926 9.88582C13.6519 9.77229 13.4176 9.58003 13.2528 9.33335C13.088 9.08668 13 8.79667 13 8.5C13 8.10218 13.158 7.72064 13.4393 7.43934C13.7206 7.15804 14.1022 7 14.5 7ZM18.876 17.481C18.7898 17.638 18.6631 17.769 18.509 17.8603C18.3549 17.9516 18.1791 17.9999 18 18H6C5.82952 18.0001 5.66186 17.9566 5.51293 17.8736C5.364 17.7907 5.23874 17.671 5.14907 17.526C5.05939 17.381 5.00827 17.2155 5.00056 17.0452C4.99285 16.8749 5.0288 16.7055 5.105 16.553L8.605 9.553C8.68557 9.39154 8.80833 9.25488 8.96026 9.15753C9.1122 9.06017 9.28764 9.00574 9.468 9C9.64992 8.98988 9.83098 9.03147 9.99025 9.11995C10.1495 9.20843 10.2805 9.3402 10.368 9.5L13.143 14.257L14.689 12.37C14.7894 12.2477 14.9174 12.151 15.0625 12.0878C15.2076 12.0246 15.3656 11.9967 15.5236 12.0065C15.6815 12.0162 15.8349 12.0633 15.9711 12.1439C16.1073 12.2245 16.2224 12.3363 16.307 12.47L18.848 16.47C18.9421 16.6208 18.9943 16.794 18.9992 16.9717C19.0042 17.1494 18.9616 17.3252 18.876 17.481Z"
                    fill="#FAFAFA"
                  />
                </svg>
                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`mr- text-nowrap text-${
                    props.livesessiontext || "white"
                  } mr-[17px] font-normal `}
                >
                  Post Management
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Accordion>
          <Accordion {...commonProps} placeholder="collapsed" open={open === 2}>
            <ListItem {...commonProps} placeholder="" className="p-0">
              <AccordionHeader
                {...commonProps}
                placeholder=""
                style={{ backgroundColor: props.livesessionbg }}
                className={`border-b-0 p-2 rounded-lg ml-2`}
                onClick={() => {
                  router.push("/sessionmanage/sessiontable");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M2 19C2 20.7 3.3 22 5 22H19C20.7 22 22 20.7 22 19V11H2V19ZM19 4H17V3C17 2.4 16.6 2 16 2C15.4 2 15 2.4 15 3V4H9V3C9 2.4 8.6 2 8 2C7.4 2 7 2.4 7 3V4H5C3.3 4 2 5.3 2 7V9H22V7C22 5.3 20.7 4 19 4Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M13.25 16.067C13.5833 16.2594 13.5833 16.7406 13.25 16.933L11 18.2321C10.6667 18.4245 10.25 18.1839 10.25 17.799V15.201C10.25 14.8161 10.6667 14.5755 11 14.7679L13.25 16.067Z"
                    fill="#171717"
                  />
                </svg>
                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`mr- text-nowrap text-${
                    props.livesessiontext || "white"
                  }  font-normal `}
                >
                  Booking Management
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Accordion>
          <Accordion {...commonProps} placeholder="collapsed" open={open === 2}>
            <ListItem {...commonProps} placeholder="" className="p-0">
              <AccordionHeader
                {...commonProps}
                placeholder=""
                style={{ backgroundColor: props.livesessionbg }}
                className={`border-b-0 p-2 rounded-lg ml-2`}
                onClick={() => {
                  router.push("/sessionmanage/sessiontable");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M11 5.1857C9.06 4.52753 3.646 3.25323 2.293 4.58034C2.10716 4.76202 2.0019 5.00794 2 5.26492V17.6851C2 17.8568 2.04621 18.0254 2.13398 18.1741C2.22175 18.3228 2.34799 18.4462 2.50001 18.5321C2.65203 18.6179 2.82447 18.6631 3.00001 18.6631C3.17554 18.6631 3.34798 18.6179 3.5 18.5321C4.559 18.2485 9.765 19.289 11 19.999V5.1857Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M21.707 4.58034C20.353 3.25421 14.94 4.52753 13 5.1857V20C14.234 19.29 19.436 18.2504 20.5 18.533C20.6521 18.6189 20.8246 18.6641 21.0002 18.6641C21.1759 18.664 21.3484 18.6188 21.5004 18.5328C21.6525 18.4469 21.7787 18.3233 21.8664 18.1745C21.9541 18.0257 22.0002 17.8569 22 17.6851V5.26492C21.9981 5.00794 21.8928 4.76202 21.707 4.58034Z"
                    fill="#FAFAFA"
                  />
                </svg>
                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`mr-[22px] text-nowrap text-${
                    props.livesessiontext || "white"
                  }  font-normal `}
                >
                  Blog Management
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Accordion>
          <Accordion
            {...commonProps}
            placeholder=""
            open={open === 2}
            icon={
              <ChevronDownIcon
                {...commonProps}
                strokeWidth={2.5}
                color="white"
                className={`mx-auto color-white  h-4 w-4 transition-transform ${
                  open === 2 ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem
              {...commonProps}
              placeholder=""
              className="p-0"
              selected={open === 2}
            >
              <AccordionHeader
                {...commonProps}
                style={{ backgroundColor: props.subscriptionbg }}
                placeholder=""
                onClick={() => handleOpen(2)}
                className={`border-b-0 p-3 rounded-lg`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V6C22 5.46957 21.7893 4.96086 21.4142 4.58579C21.0391 4.21071 20.5304 4 20 4ZM8.5 7C8.99445 7 9.4778 7.14662 9.88893 7.42133C10.3 7.69603 10.6205 8.08648 10.8097 8.54329C10.9989 9.00011 11.0484 9.50277 10.952 9.98773C10.8555 10.4727 10.6174 10.9181 10.2678 11.2678C9.91814 11.6174 9.47268 11.8555 8.98773 11.952C8.50277 12.0484 8.00011 11.9989 7.54329 11.8097C7.08648 11.6205 6.69603 11.3 6.42133 10.8889C6.14662 10.4778 6 9.99445 6 9.5C6 8.83696 6.26339 8.20107 6.73223 7.73223C7.20107 7.26339 7.83696 7 8.5 7ZM5.014 17.021L5.171 16.396C5.31091 15.6115 5.71982 14.9003 6.32739 14.3847C6.93496 13.8692 7.70322 13.5814 8.5 13.571C9.29276 13.5819 10.0572 13.8675 10.663 14.379C11.2687 14.8905 11.6784 15.5963 11.822 16.376L11.981 16.998L5.014 17.021ZM18 16H15C14.7348 16 14.4804 15.8946 14.2929 15.7071C14.1054 15.5196 14 15.2652 14 15C14 14.7348 14.1054 14.4804 14.2929 14.2929C14.4804 14.1054 14.7348 14 15 14H18C18.2652 14 18.5196 14.1054 18.7071 14.2929C18.8946 14.4804 19 14.7348 19 15C19 15.2652 18.8946 15.5196 18.7071 15.7071C18.5196 15.8946 18.2652 16 18 16ZM18 13H15C14.7348 13 14.4804 12.8946 14.2929 12.7071C14.1054 12.5196 14 12.2652 14 12C14 11.7348 14.1054 11.4804 14.2929 11.2929C14.4804 11.1054 14.7348 11 15 11H18C18.2652 11 18.5196 11.1054 18.7071 11.2929C18.8946 11.4804 19 11.7348 19 12C19 12.2652 18.8946 12.5196 18.7071 12.7071C18.5196 12.8946 18.2652 13 18 13ZM18 10H15C14.7348 10 14.4804 9.89464 14.2929 9.70711C14.1054 9.51957 14 9.26522 14 9C14 8.73478 14.1054 8.48043 14.2929 8.29289C14.4804 8.10536 14.7348 8 15 8H18C18.2652 8 18.5196 8.10536 18.7071 8.29289C18.8946 8.48043 19 8.73478 19 9C19 9.26522 18.8946 9.51957 18.7071 9.70711C18.5196 9.89464 18.2652 10 18 10Z"
                    fill="#FAFAFA"
                  />
                </svg>

                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`mr-[85px] text-${
                    props.subsciptiontext || "white"
                  } font-normal `}
                >
                  Query
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody {...commonProps} className="py-1">
              <List
                {...commonProps}
                placeholder=""
                className="p-0"
                color="white"
              >
                <ListItem
                  {...commonProps}
                  style={{ backgroundColor: props.subscription1bg }}
                  placeholder=""
                  className={`border-b-0 p-3  rounded-lg`}
                  color="white"
                >
                  <ListItemPrefix {...commonProps} placeholder="">
                    <ChevronRightIcon
                      {...commonProps}
                      strokeWidth={3}
                      color="white"
                      className="h-3 w-5"
                    />
                  </ListItemPrefix>
                  <span
                    onClick={() => {
                      router.push("/submanage/subtable");
                    }}
                    className={`mr-auto text-${
                      props.subscription1text || "white"
                    } font-normal `}
                  >
                    Query Management
                  </span>
                </ListItem>
                <ListItem
                  {...commonProps}
                  style={{ backgroundColor: props.subscription2bg }}
                  placeholder=""
                  className={`border-b-0 p-3  rounded-lg`}
                >
                  <ListItemPrefix {...commonProps} placeholder="">
                    <ChevronRightIcon
                      {...commonProps}
                      strokeWidth={3}
                      color="white"
                      className="h-3 w-5"
                    />
                  </ListItemPrefix>
                  <span
                    onClick={() => {
                      router.push("/submanage/subtable");
                    }}
                    className={`mr-auto text-nowrap  text-${
                      props.subscription2text || "white"
                    } font-normal `}
                  >
                    Absuse Management
                  </span>
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
          <Accordion
            {...commonProps}
            placeholder=""
            open={open === 10}
            icon={
              <ChevronDownIcon
                {...commonProps}
                strokeWidth={2.5}
                color="white"
                className={`mx-auto color-white  h-4 w-4 transition-transform ${
                  open === 10 ? "rotate-180" : ""
                }`}
              />
            }
          >
            <ListItem
              {...commonProps}
              placeholder=""
              className="p-0"
              selected={open === 10}
            >
              <AccordionHeader
                {...commonProps}
                style={{ backgroundColor: props.subscriptionbg }}
                placeholder=""
                onClick={() => handleOpen(10)}
                className={`border-b-0 p-3 rounded-lg`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3.875 6H2.625C2.27982 6 2 6.26863 2 6.6V7.8C2 8.13137 2.27982 8.4 2.625 8.4H3.875C4.22018 8.4 4.5 8.13137 4.5 7.8V6.6C4.5 6.26863 4.22018 6 3.875 6Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M3.875 10.8H2.625C2.27982 10.8 2 11.0686 2 11.4V12.6C2 12.9314 2.27982 13.2 2.625 13.2H3.875C4.22018 13.2 4.5 12.9314 4.5 12.6V11.4C4.5 11.0686 4.22018 10.8 3.875 10.8Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M3.875 15.6H2.625C2.27982 15.6 2 15.8686 2 16.2V17.4C2 17.7314 2.27982 18 2.625 18H3.875C4.22018 18 4.5 17.7314 4.5 17.4V16.2C4.5 15.8686 4.22018 15.6 3.875 15.6Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M20.75 8.4H8.25C7.91848 8.4 7.60054 8.27357 7.36612 8.04853C7.1317 7.82348 7 7.51826 7 7.2C7 6.88174 7.1317 6.57652 7.36612 6.35147C7.60054 6.12643 7.91848 6 8.25 6H20.75C21.0815 6 21.3995 6.12643 21.6339 6.35147C21.8683 6.57652 22 6.88174 22 7.2C22 7.51826 21.8683 7.82348 21.6339 8.04853C21.3995 8.27357 21.0815 8.4 20.75 8.4Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M20.75 13.2H8.25C7.91848 13.2 7.60054 13.0736 7.36612 12.8485C7.1317 12.6235 7 12.3183 7 12C7 11.6817 7.1317 11.3765 7.36612 11.1515C7.60054 10.9264 7.91848 10.8 8.25 10.8H20.75C21.0815 10.8 21.3995 10.9264 21.6339 11.1515C21.8683 11.3765 22 11.6817 22 12C22 12.3183 21.8683 12.6235 21.6339 12.8485C21.3995 13.0736 21.0815 13.2 20.75 13.2Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M20.75 18H8.25C7.91848 18 7.60054 17.8736 7.36612 17.6485C7.1317 17.4235 7 17.1183 7 16.8C7 16.4817 7.1317 16.1765 7.36612 15.9515C7.60054 15.7264 7.91848 15.6 8.25 15.6H20.75C21.0815 15.6 21.3995 15.7264 21.6339 15.9515C21.8683 16.1765 22 16.4817 22 16.8C22 17.1183 21.8683 17.4235 21.6339 17.6485C21.3995 17.8736 21.0815 18 20.75 18Z"
                    fill="#FAFAFA"
                  />
                </svg>

                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`mr-[65px] text-nowrap text-${
                    props.subsciptiontext || "white"
                  } font-normal `}
                >
                  Category
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody {...commonProps} className="py-1">
              <List
                {...commonProps}
                placeholder=""
                className="p-0"
                color="white"
              >
                <ListItem
                  {...commonProps}
                  style={{ backgroundColor: props.subscription1bg }}
                  placeholder=""
                  className={`border-b-0 p-3  rounded-lg`}
                  color="white"
                >
                  <ListItemPrefix {...commonProps} placeholder="">
                    <ChevronRightIcon
                      {...commonProps}
                      strokeWidth={3}
                      color="white"
                      className="h-3 w-5"
                    />
                  </ListItemPrefix>
                  <span
                    onClick={() => {
                      router.push("/submanage/subtable");
                    }}
                    className={`mr-auto text-${
                      props.subscription1text || "white"
                    } font-normal `}
                  >
                    Exercise Category
                  </span>
                </ListItem>
                <ListItem
                  {...commonProps}
                  style={{ backgroundColor: props.subscription2bg }}
                  placeholder=""
                  className={`border-b-0 p-3  rounded-lg`}
                >
                  <ListItemPrefix {...commonProps} placeholder="">
                    <ChevronRightIcon
                      {...commonProps}
                      strokeWidth={3}
                      color="white"
                      className="h-3 w-5"
                    />
                  </ListItemPrefix>
                  <span
                    onClick={() => {
                      router.push("/submanage/subtable");
                    }}
                    className={`mr-auto text-nowrap  text-${
                      props.subscription2text || "white"
                    } font-normal `}
                  >
                    Blog Category
                  </span>
                </ListItem>
                <ListItem
                  {...commonProps}
                  style={{ backgroundColor: props.subscription2bg }}
                  placeholder=""
                  className={`border-b-0 p-3  rounded-lg`}
                >
                  <ListItemPrefix {...commonProps} placeholder="">
                    <ChevronRightIcon
                      {...commonProps}
                      strokeWidth={3}
                      color="white"
                      className="h-3 w-5"
                    />
                  </ListItemPrefix>
                  <span
                    onClick={() => {
                      router.push("/submanage/subtable");
                    }}
                    className={`mr-auto text-nowrap  text-${
                      props.subscription2text || "white"
                    } font-normal `}
                  >
                    Focus Area
                  </span>
                </ListItem>
                <ListItem
                  {...commonProps}
                  style={{ backgroundColor: props.subscription2bg }}
                  placeholder=""
                  className={`border-b-0 p-3  rounded-lg`}
                >
                  <ListItemPrefix {...commonProps} placeholder="">
                    <ChevronRightIcon
                      {...commonProps}
                      strokeWidth={3}
                      color="white"
                      className="h-3 w-5"
                    />
                  </ListItemPrefix>
                  <span
                    onClick={() => {
                      router.push("/submanage/subtable");
                    }}
                    className={`mr-auto text-nowrap  text-${
                      props.subscription2text || "white"
                    } font-normal `}
                  >
                    Blog Tags
                  </span>
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>

          <Accordion {...commonProps} open={open === 3} placeholder="">
            <ListItem {...commonProps} placeholder="" className="p-0">
              <AccordionHeader
                {...commonProps}
                placeholder=""
                style={{ backgroundColor: props.achivementbg }}
                onClick={() => {
                  router.push("/mediaManagement-table/");
                }}
                className={`border-b-0 p-3 bg-neutral-800 rounded-lg`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 7.25C2.0335 7.25 1.25 8.0335 1.25 9V20C1.25 20.9665 2.0335 21.75 3 21.75H21C21.9665 21.75 22.75 20.9665 22.75 20V9C22.75 8.0335 21.9665 7.25 21 7.25H3Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M10.4301 10.3856C10.201 10.2252 9.90169 10.2056 9.65364 10.3348C9.40559 10.4639 9.25 10.7203 9.25 11V18C9.25 18.2797 9.40559 18.5361 9.65364 18.6652C9.90169 18.7944 10.201 18.7748 10.4301 18.6144L15.4301 15.1144C15.6306 14.9741 15.75 14.7447 15.75 14.5C15.75 14.2553 15.6306 14.0259 15.4301 13.8856L10.4301 10.3856Z"
                    fill="#262626"
                  />
                  <path
                    fillRule="evenodd"
                    clip-rule="evenodd"
                    d="M3.25 5.5C3.25 5.08579 3.58579 4.75 4 4.75H20C20.4142 4.75 20.75 5.08579 20.75 5.5C20.75 5.91421 20.4142 6.25 20 6.25H4C3.58579 6.25 3.25 5.91421 3.25 5.5ZM5.25 3C5.25 2.58579 5.58579 2.25 6 2.25H18C18.4142 2.25 18.75 2.58579 18.75 3C18.75 3.41421 18.4142 3.75 18 3.75H6C5.58579 3.75 5.25 3.41421 5.25 3Z"
                    fill="#FAFAFA"
                  />
                </svg>
                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`mr-[8px] text-${
                    props.achivementtext || "white"
                  } font-normal `}
                >
                  Media Management
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Accordion>
          <Accordion {...commonProps} open={open === 3} placeholder="">
            <ListItem {...commonProps} placeholder="" className="p-0">
              <AccordionHeader
                {...commonProps}
                placeholder=""
                style={{ backgroundColor: props.achivementbg }}
                onClick={() => {
                  router.push("/achivemanage");
                }}
                className={`border-b-0 p-3 rounded-lg`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M16.707 9.48C16.5195 9.28772 16.2652 9.17971 16 9.17971C15.7348 9.17971 15.4805 9.28772 15.293 9.48L13 11.8318V3.02564C13 2.75362 12.8946 2.49275 12.7071 2.3004C12.5196 2.10806 12.2652 2 12 2C11.7348 2 11.4804 2.10806 11.2929 2.3004C11.1054 2.49275 11 2.75362 11 3.02564V11.8318L8.707 9.48C8.61475 9.38204 8.50441 9.30391 8.3824 9.25015C8.2604 9.1964 8.12918 9.16811 7.9964 9.16692C7.86362 9.16574 7.73194 9.19169 7.60905 9.24326C7.48615 9.29483 7.3745 9.37099 7.2806 9.46729C7.18671 9.56359 7.11246 9.6781 7.06218 9.80415C7.0119 9.9302 6.9866 10.0653 6.98775 10.2014C6.9889 10.3376 7.01649 10.4722 7.0689 10.5973C7.12131 10.7225 7.19749 10.8356 7.293 10.9303L11.293 15.0328C11.3859 15.1283 11.4962 15.2041 11.6177 15.2558C11.7392 15.3075 11.8695 15.3341 12.001 15.3341C12.1325 15.3341 12.2628 15.3075 12.3843 15.2558C12.5058 15.2041 12.6161 15.1283 12.709 15.0328L16.709 10.9303C16.8962 10.7376 17.0012 10.4767 17.0008 10.2047C17.0004 9.93274 16.8947 9.67206 16.707 9.48Z"
                    fill="#FAFAFA"
                  />
                  <path
                    d="M20 13.7949H17.45L14.475 16.8462C14.15 17.1795 13.7641 17.444 13.3395 17.6244C12.9148 17.8048 12.4597 17.8977 12 17.8977C11.5403 17.8977 11.0852 17.8048 10.6605 17.6244C10.2359 17.444 9.85001 17.1795 9.525 16.8462L6.55 13.7949H4C3.46957 13.7949 2.96086 14.011 2.58579 14.3957C2.21071 14.7804 2 15.3021 2 15.8462V19.9487C2 20.4928 2.21071 21.0145 2.58579 21.3992C2.96086 21.7839 3.46957 22 4 22H20C20.5304 22 21.0391 21.7839 21.4142 21.3992C21.7893 21.0145 22 20.4928 22 19.9487V15.8462C22 15.3021 21.7893 14.7804 21.4142 14.3957C21.0391 14.011 20.5304 13.7949 20 13.7949ZM17.5 19.9487C17.2033 19.9487 16.9133 19.8585 16.6666 19.6894C16.42 19.5204 16.2277 19.2801 16.1142 18.999C16.0007 18.7179 15.9709 18.4086 16.0288 18.1101C16.0867 17.8117 16.2296 17.5376 16.4393 17.3224C16.6491 17.1072 16.9164 16.9607 17.2074 16.9014C17.4983 16.842 17.7999 16.8725 18.074 16.9889C18.3481 17.1053 18.5824 17.3025 18.7472 17.5555C18.912 17.8085 19 18.106 19 18.4103C19 18.8183 18.842 19.2096 18.5607 19.4981C18.2794 19.7866 17.8978 19.9487 17.5 19.9487Z"
                    fill="#FAFAFA"
                  />
                </svg>
                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`mr-[8px] text-${
                    props.achivementtext || "white"
                  } font-normal `}
                >
                  Report Management
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Accordion>

          <Accordion {...commonProps} placeholder="" open={open === 4}>
            <ListItem {...commonProps} placeholder="" className="p-0">
              <AccordionHeader
                {...commonProps}
                placeholder=""
                style={{ backgroundColor: props.specialclassbg }}
                onClick={() => {
                  router.push("/specialclassmanage/specialclasstable");
                }}
                className={`border-b-0 p-3  rounded-lg`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 0.640015L8.23 3.00001H5V5.00001L2.97 6.29001C2.39 6.64001 2 7.27001 2 8.00001V18C2 18.5304 2.21071 19.0392 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C21.11 20 22 19.11 22 18V8.00001C22 7.27001 21.61 6.64001 21.03 6.29001L19 5.00001V3.00001H15.77M7 5.00001H17V9.88001L12 13L7 9.88001M8 6.00001V7.50001H16V6.00001M5 7.38001V8.63001L4 8.00001M19 7.38001L20 8.00001L19 8.63001M8 8.50001V10H16V8.50001H8Z"
                    fill="#FAFAFA"
                  />
                </svg>
                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`ml-[7px] text-nowrap text-${
                    props.specialclasstext || "white"
                  } font-normal `}
                >
                  Newsletter Management
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Accordion>

          <Accordion {...commonProps} open={open === 4} placeholder="">
            <ListItem {...commonProps} placeholder="" className="p-0">
              <AccordionHeader
                {...commonProps}
                style={{ backgroundColor: props.querybg }}
                placeholder=""
                onClick={() => {
                  router.push("/querymanage/querytable");
                }}
                className={`border-b-0 p-3 rounded-lg`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clipPath="url(#clip0_2316_121870)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.84717 7.41077H2.67856V5.43994C2.67856 2.83641 4.80905 0.705872 7.41258 0.705872C10.0162 0.705872 12.1447 2.83641 12.1447 5.43994H9.97804C9.97804 4.03095 8.8196 2.87246 7.41258 2.87246C6.00562 2.87246 4.84717 4.03095 4.84717 5.43994V7.41077ZM10.1133 19.103H1.61828C1.14129 19.103 0.752441 18.7162 0.752441 18.2391V9.02757C0.752441 8.55255 1.14129 8.16371 1.61828 8.16371H13.2069C13.6839 8.16371 14.0707 8.55255 14.0707 9.02757V10.6617C11.5897 11.8047 9.86567 14.3141 9.86567 17.2229C9.86567 17.8732 9.95183 18.5034 10.1133 19.103ZM7.41258 10.3463C6.48261 10.3463 5.72703 11.102 5.72703 12.0319C5.72703 12.6392 6.04769 13.1703 6.52872 13.467V16.0365C6.52872 16.5235 6.92557 16.9203 7.41258 16.9203C7.89762 16.9203 8.29649 16.5235 8.29649 16.0365V13.467C8.77752 13.1703 9.09621 12.6392 9.09621 12.0319C9.09621 11.102 8.34256 10.3463 7.41258 10.3463ZM17.0854 10.7561C20.6545 10.7561 23.5522 13.6538 23.5522 17.2229C23.5522 20.792 20.6545 23.6896 17.0854 23.6896C13.5163 23.6896 10.6186 20.792 10.6186 17.2229C10.6186 13.6538 13.5163 10.7561 17.0854 10.7561ZM13.2606 20.4166C13.2491 20.4846 13.2681 20.5542 13.3126 20.607C13.3571 20.6596 13.4225 20.69 13.4915 20.69C14.686 20.6911 19.4851 20.6911 20.6794 20.6911C20.7487 20.6911 20.8144 20.6606 20.8591 20.6077C20.9038 20.5548 20.923 20.4849 20.9114 20.4166C20.5839 18.6008 18.996 17.2229 17.0854 17.2229C15.1758 17.2229 13.5879 18.6007 13.2606 20.4166ZM17.0854 16.7523C18.1685 16.7523 19.0507 15.8692 19.0507 14.787C19.0507 13.7049 18.1685 12.8218 17.0854 12.8218C16.0032 12.8218 15.1211 13.7049 15.1211 14.787C15.1211 15.8692 16.0032 16.7523 17.0854 16.7523Z"
                      fill="#FAFAFA"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2316_121870">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <Typography
                  {...commonProps}
                  placeholder=""
                  color="white"
                  className={`mr-[50px] text-nowrap text-${
                    props.querytext || "white"
                  } font-normal `}
                >
                  Access Control
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Accordion>
        </List>
      </Card>
    </>
  );
};

export default SidebarDesign;
