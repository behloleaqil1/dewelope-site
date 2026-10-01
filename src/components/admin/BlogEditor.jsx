import React from "react";
import {Field, TextInput, TextArea, StringList, ItemList} from "./fields.jsx";
import {slugify} from "../../utils/slug.js";

// Blog post model:
// { id, slug, title, excerpt, body, coverImage, author, tags[],
//   status: "draft"|"published", publishedAt, seoTitle, seoDescription }

function newPost() {
    const now = new Date().toISOString();
    return {
        id: `post-${Date.now()}`,
        slug: "",
        title: "",
        excerpt: "",
        body: "",
        coverImage: "",
        author: "Baneen",
        tags: [],
        status: "draft",
        publishedAt: now,
        seoTitle: "",
        seoDescription: "",
    };
}

export function BlogEditor({value, onChange}) {
    return (
        <ItemList
            items={value} onChange={onChange} itemLabel="post" newItem={newPost}
            renderItem={(post, update) => {
                const autoSlug = () => update({slug: slugify(post.title)});
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <Field label="Status">
                                <select
                                    value={post.status}
                                    onChange={(e) => update({status: e.target.value})}
                                    className="rounded-lg bg-surface-2 border border-border px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/60"
                                >
                                    <option value="draft">Draft (hidden)</option>
                                    <option value="published">Published (live)</option>
                                </select>
                            </Field>
                            <span className={
                                "text-[11px] font-mono uppercase tracking-widest px-2 py-1 rounded-full " +
                                (post.status === "published" ? "bg-green-500/15 text-green-400" : "bg-white/10 text-muted")
                            }>
                                {post.status}
                            </span>
                        </div>

                        <Field label="Title"><TextInput value={post.title} onChange={(v) => update({title: v})}/></Field>

                        <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-end">
                            <Field label="Slug" hint="URL: /blog/<slug>"><TextInput value={post.slug} onChange={(v) => update({slug: slugify(v)})}/></Field>
                            <button type="button" onClick={autoSlug}
                                    className="h-[38px] px-3 rounded-lg border border-border text-xs font-mono uppercase tracking-widest text-muted hover:text-white hover:border-white/30">
                                From title
                            </button>
                        </div>

                        <Field label="Excerpt" hint="Short summary shown in the blog list"><TextArea value={post.excerpt} onChange={(v) => update({excerpt: v})} rows={2}/></Field>
                        <Field label="Body" hint="Plain text / simple markdown. Blank lines separate paragraphs."><TextArea value={post.body} onChange={(v) => update({body: v})} rows={10}/></Field>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Cover image URL"><TextInput value={post.coverImage} onChange={(v) => update({coverImage: v})}/></Field>
                            <Field label="Author"><TextInput value={post.author} onChange={(v) => update({author: v})}/></Field>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Published date"><TextInput value={(post.publishedAt || "").slice(0, 10)} onChange={(v) => update({publishedAt: new Date(v || Date.now()).toISOString()})} type="date"/></Field>
                            <Field label="Tags"><StringList items={post.tags} onChange={(v) => update({tags: v})} placeholder="Add tag"/></Field>
                        </div>

                        <h4 className="text-xs font-semibold text-white pt-1">Post SEO (optional)</h4>
                        <Field label="SEO title" hint="Defaults to post title"><TextInput value={post.seoTitle} onChange={(v) => update({seoTitle: v})}/></Field>
                        <Field label="SEO description" hint="Defaults to excerpt"><TextArea value={post.seoDescription} onChange={(v) => update({seoDescription: v})} rows={2}/></Field>
                    </div>
                );
            }}
        />
    );
}
