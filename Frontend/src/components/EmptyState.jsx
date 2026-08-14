const EmptyState = ({
    title = "No data found",
    description = "There is nothing to display right now."
}) => {

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">

            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl mb-4">
                📭
            </div>

            <h3 className="text-lg font-semibold">
                {title}
            </h3>

            <p className="text-sm text-muted-foreground mt-2 max-w-md">
                {description}
            </p>

        </div>
    );
};

export default EmptyState;