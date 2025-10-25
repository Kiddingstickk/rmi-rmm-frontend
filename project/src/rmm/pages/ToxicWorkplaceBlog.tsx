import React, { useEffect } from 'react';
import ResponsiveNavbar from '../components/Navbar/navbar';
import { useAuth } from '../../rmi/lib/useAuth';

const ToxicWorkplaceBlog = () => {
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    // Inject structured data for SEO
    const jsonLd = document.createElement('script');
    jsonLd.setAttribute('type', 'application/ld+json');
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "How to Deal with a Toxic Workplace and Toxic Managers: Signs, Survival, and Solutions",
      "description": "Learn how to identify toxic workplace culture and toxic manager traits, protect your mental health, and raise your voice for change.",
      "author": {
        "@type": "Organization",
        "name": "Rate My Management"
      },
      "datePublished": "2025-09-09",
      "url": "https://ratemymanagement.com/blog/deal-with-toxic-manager"
    });
    document.head.appendChild(jsonLd);
    return () => {
      document.head.removeChild(jsonLd);
    };
  }, []);

  useEffect(() => {
    document.title = "How to Deal with a Toxic Workplace and Toxic Managers | Rate My Management";

    const metaTags = [
      { name: "description", content: "Learn how to identify toxic workplace culture and toxic manager traits, protect your mental health, and raise your voice for change." },
      { name: "keywords", content: "toxic workplace, toxic manager, workplace harassment, manager accountability, mental health in the workplace, job stress, resignation letter due to toxic manager" },
      { property: "og:type", content: "article" },
      { property: "og:title", content: "How to Deal with a Toxic Workplace and Toxic Managers" },
      { property: "og:description", content: "Learn how to identify toxic workplace culture and toxic manager traits, protect your mental health, and raise your voice for change." },
      { property: "og:url", content: "https://ratemymanagement.com/blog/deal-with-toxic-manager" },
      { property: "og:image", content: "https://ratemymanagement.com/images/blog/toxic-manager.jpg" },
      { property: "og:site_name", content: "Rate My Management" },
      { property: "article:publisher", content: "https://www.facebook.com/ratemymanagement" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "How to Deal with a Toxic Workplace and Toxic Managers" },
      { name: "twitter:description", content: "Learn how to identify toxic workplace culture and toxic manager traits, protect your mental health, and raise your voice for change." },
      { name: "twitter:image", content: "https://ratemymanagement.com/images/blog/toxic-manager.jpg" },
      { name: "twitter:site", content: "@ratemymanagement" },
      { name: "twitter:creator", content: "@ratemymanagement" },
      { rel: "canonical", href: "https://ratemymanagement.com/blog/deal-with-toxic-manager" }
    ];

    metaTags.forEach(tag => {
      const el = document.createElement(tag.rel ? 'link' : 'meta');
      Object.entries(tag).forEach(([key, value]) => el.setAttribute(key, value));
      document.head.appendChild(el);
    });

    return () => {
      metaTags.forEach(tag => {
        const selector = tag.name ? `meta[name="${tag.name}"]` :
                         tag.property ? `meta[property="${tag.property}"]` :
                         tag.rel ? `link[rel="${tag.rel}"]` : null;
        if (selector) {
          const el = document.head.querySelector(selector);
          if (el) document.head.removeChild(el);
        }
      });
    };
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans">
      <ResponsiveNavbar isLoggedIn={isLoggedIn} onLogout={logout} />
      <main className="blog-post prose prose-lg mx-auto py-8 text-gray-800">
        <article>
          <h1 className="text-3xl font-bold mb-4 text-blue-900">
            How to Deal with a Toxic Workplace and Toxic Managers: Signs, Survival, and Solutions
          </h1>
          <p className="text-sm text-gray-500 mb-6">Published on September 9, 2025 • by Rate My Management</p>
          <img
            src="https://ratemymanagement.com/images/blog/toxic-manager.jpg"
            alt="Frustrated employee in a toxic workplace"
            className="w-full rounded-2xl shadow-md mb-6"
          />
  
          <section className="space-y-6">
            <p>In today’s fast-paced job market, finding a workplace that truly supports growth, mental health, and transparency can feel like chasing a unicorn. While many companies boast about culture and values, the reality for countless employees is far more complex.</p>
  
            <p>Toxic workplaces and toxic managers are not just buzzwords—they’re lived experiences that affect job satisfaction, career progression, and emotional well-being. Whether you’re dealing with a manipulative boss, workplace bullying, or a culture that rewards silence over accountability, this guide will help you:</p>
  
            <ul>
              <li>Recognize the signs of toxicity</li>
              <li>Understand the psychological impact</li>
              <li>Learn survival strategies</li>
              <li>Decide when to speak up or walk away</li>
              <li>Contribute to building healthier workplaces</li>
            </ul>
  
            <h2>🚩 What Is a Toxic Workplace?</h2>
            <p>A toxic workplace is any environment that consistently undermines your mental health, safety, or ability to perform without fear or manipulation. It’s not about one bad day—it’s about patterns.</p>
  
            <ul>
              <li>Gossip-driven culture and cliques</li>
              <li>Lack of transparency from leadership</li>
              <li>High turnover and burnout</li>
              <li>Workplace harassment or bullying</li>
              <li>Fear of speaking up</li>
              <li>Unclear job expectations and shifting goals</li>
              <li>Passive-aggressive behavior or retaliation</li>
            </ul>
  
            <p>
  <em>💡 Fact: According to the <a href="https://sloanreview.mit.edu/article/toxic-culture-is-driving-the-great-resignation/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">MIT Sloan Management Review</a>, a toxic corporate culture is 10.4 times more likely to drive employees away than compensation issues.</em>
</p>
  
            <h2>🧟 Traits of a Toxic Manager</h2>
            <p>Toxic workplaces often start with toxic leadership. A manager doesn’t have to yell or throw things to damage morale — subtle behaviors can be just as destructive.</p>
  
            <ul>
              <li>Micromanagement and control issues</li>
              <li>Public shaming or humiliation</li>
              <li>Taking credit for others’ work</li>
              <li>Blaming employees for their own mistakes</li>
              <li>Manipulation or gaslighting</li>
              <li>Playing favorites and creating division</li>
              <li>Ignoring employee contributions</li>
            </ul>
  
            <h2>🧠 The Psychological Impact</h2>
            <ul>
              <li>Imposter syndrome: Feeling like you’re never good enough</li>
              <li>Burnout: Emotional exhaustion, cynicism, and reduced productivity</li>
              <li>Anxiety or depression: Chronic stress taking a toll on mental health</li>
              <li>Loss of confidence: Doubting your skills and decisions</li>
              <li>Isolation: Withdrawing from colleagues and friends</li>
            </ul>
  
            <p>
  <em>💡 Fact: The <a href="https://www.apa.org/news/press/releases/stress/2023/workforce" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">American Psychological Association</a> found that 77% of workers report workplace stress affects their physical health — showing how deeply environments can shape well-being.</em>
</p>
  
            <h2>🛡️ How to Survive a Toxic Workplace</h2>
            <ul>
              <li><strong>Document Everything:</strong> Keep records of meetings, emails, and incidents of harassment or manipulation.</li>
              <li><strong>Set Boundaries:</strong> Don’t let work invade your personal time. Turn off notifications after hours.</li>
              <li><strong>Build External Support:</strong> Talk to mentors, friends, or therapists. Validation matters.</li>
              <li><strong>Focus on What You Can Control:</strong> Reclaim control by mastering your tasks or preparing your exit strategy.</li>
              <li><strong>Practice Emotional Detachment:</strong> Remind yourself: “This is about them, not me.”</li>
            </ul>
  
            <p>👉 Quick Tip: If you’ve faced toxicity, share your experience on anonymous platforms like <a href="/rate-manager" className="text-blue-600 font-semibold hover:underline">Rate My Management</a>. You help others identify warning signs before joining.</p>
  
            <h2>📣 When to Speak Up or Leave</h2>
            <ul>
              <li>Use HR channels or anonymous reporting tools</li>
              <li>Present your documentation clearly and calmly</li>
              <li>Know your rights regarding workplace harassment and retaliation</li>
              <li>Seek legal counsel if issues involve discrimination or abuse</li>
            </ul>
  
            <h2>🌱 Building a Healthier Workplace Culture</h2>
            <ul>
              <li><strong>Embrace Manager Accountability:</strong> Evaluate leaders on behavior, not just results.</li>
              <li><strong>Promote Psychological Safety:</strong> Employees should feel safe to speak up.</li>
              <li><strong>Invest in Mental Health:</strong> Offer therapy stipends, mental health days, and training.</li>
              <li><strong>Encourage Employee Voice:</strong> Create feedback channels and act on them.</li>
            </ul>
  
            <h2>💬 Real Stories, Real Change</h2>
            <p>One of the most powerful ways to fight toxicity is to share your story. When employees speak up—through anonymous reviews, exit interviews, or platforms like Rate My Management—they empower others and push companies toward reform.</p>
  
            <p><em>💡 Fact: <a href="https://www.glassdoor.com/research/culture-salary/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline" > Glassdoor research </a>{' '} shows that 56% of employees say a strong workplace culture is more important than salary when it comes to job satisfaction. </em> </p>

  
            <h2>🧭 Conclusion: Your Voice Matters</h2>
            <p>You don’t have to tolerate toxicity. Whether you choose to speak up, move on, or help build something better, your experience is valid and powerful.</p>
  
            <p>By identifying toxic patterns, protecting your mental health, and raising your voice, you contribute to a movement toward workplace transparency and reform.</p>
  
            <p className="mt-6">
              👉 Take the first step today: <a href="/rate-manager" className="text-blue-600 font-semibold hover:underline">Rate your manager anonymously</a> on Rate My Management, and help others make informed career choices.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
};

export default ToxicWorkplaceBlog;