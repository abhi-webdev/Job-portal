const Loading = ({ text = "Loading..." }) => {

    return (
        <div className="flex flex-col items-center justify-center py-16">

            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />

            <p className="mt-4 text-sm text-muted-foreground">
                {text}
            </p>

        </div>
    );
};

export default Loading;