import React from "react";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {motion} from "framer-motion";
import {FiArrowRight, FiArrowLeft} from "react-icons/fi";
import {useSiteContent} from "../utils/useSiteContent.js";

export default function Blog() {
    const {blog, seo, profile} = useSiteContent();
    const posts = (blog || [])
        .filter((p) => p.status === "published")
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const base = seo.canonicalBase || "https://dewelope.com";
    const title = seo.blog?.title || `Blog | ${profile.name}`;
    const description = seo.blog?.description || seo.defaultDescription;

    return (
        <div className="relative z-0 bg-primary noise-overlay min-h-screen text-white">
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description}/>
                <meta name="robots" content={seo.robots || "index,follow"}/>
                <link rel="canonical" href={`${base}/blog`}/>
                <meta property="og:title" content={title}/>
                <meta property="og:description" content={description}/>
                <meta property="og:url" content={`${base}/blog`}/>
                <meta property="og:image" content={seo.ogImage}/>
                <meta name="twitter:card" content={seo.twitterCard || "summary_large_image"}/>
            </Helmet>

            <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-28 pb-24">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white mb-10">
                    <FiArrowLeft/> Back to site
                </Link>

                <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">
                    The <span className="text-gradient-accent">DeWelope</span> blog
                </h1>
                <p className="mt-4 text-secondary max-w-2xl leading-relaxed">{description}</p>

                {posts.length === 0 ? (
                    <p className="mt-16 text-muted">No posts published yet. Check back soon.</p>
                ) : (
                    <div className="mt-14 grid sm:grid-cols-2 gap-6">
                        {posts.map((post, i) => (
                            <motion.article
                                key={post.id || post.slug}
                                initial={{opacity: 0, y: 20}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: true, amount: 0.2}}
                                transition={{duration: 0.5, delay: (i % 2) * 0.06}}
                                className="group rounded-2xl glass overflow-hidden flex flex-col"
                            >
                                {post.coverImage ? (
                                    <div className="aspect-[16/9] overflow-hidden">
                                        <img src={post.coverImage} alt="" loading="lazy" decoding="async"
                                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                    </div>
                                ) : null}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="text-[11px] font-mono uppercase tracking-widest text-accent-2 mb-2">
                                        {new Date(post.publishedAt).toLocaleDateString(undefined, {year: "numeric", month: "short", day: "numeric"})}
                                        {post.author ? ` · ${post.author}` : ""}
                                    </div>
                                    <h2 className="font-display font-bold text-xl leading-tight">{post.title}</h2>
                                    <p className="mt-3 text-secondary text-sm leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                                    <Link to={`/blog/${post.slug}`}
                                          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white group-hover:text-brand-400">
                                        Read more <FiArrowRight/>
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
