import SampleSocialCard from "@/src/components/SampleSocialCard";


const GeneratedTweet = ({ tweet } : { tweet: string }) => {
    return (
        <SampleSocialCard
            channel={"twitter"}
            content={tweet} />
    );
}

export default GeneratedTweet;