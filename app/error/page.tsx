export default function ErrorPage({ searchParams }: { searchParams: { message?: string | string[] } }) {
    const message = searchParams?.message;

    return (
        <div>
            <p>Sorry, something went wrong!</p>
            <h1>Error: {message}</h1>
        </div>
    )
}