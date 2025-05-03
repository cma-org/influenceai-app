import InstagramMedia from '@/app/components/functools/JsonViewer';

export default function InstagramPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">My Instagram Media</h1>
            <InstagramMedia />
        </div>
    );
}