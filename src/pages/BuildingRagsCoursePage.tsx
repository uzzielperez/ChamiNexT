import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CoursePageLayout from '../components/hub/CoursePageLayout';
import CourseOverviewSections from '../components/hub/CourseOverviewSections';
import { BookOpen, Play } from 'lucide-react';
import { courses } from '../data/products';

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration?: string;
  completed?: boolean;
}

const BuildingRagsCoursePage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lessons' | 'overview'>('lessons');

  const course = courses.find(c => c.name === 'Building RAGs (Retrieval-Augmented Generation)');

  // Lesson content embedded
  const lessonContent = {
    'introduction': `# Introduction to RAG Systems

Duration: 1 hour

## Objective
Understand what Retrieval-Augmented Generation (RAG) is, why it's important, and how it solves common LLM limitations.

## Learning outcomes
- Understand the fundamentals of RAG architecture
- Learn the difference between RAG and fine-tuning
- Identify use cases where RAG excels
- Set up your development environment

## What is RAG?
Retrieval-Augmented Generation (RAG) is a technique that enhances large language models by:
- Retrieving relevant information from external knowledge bases
- Augmenting the model's context with this information
- Generating responses based on both the model's training and retrieved data

## Why RAG?
- **Up-to-date information**: Access current data without retraining
- **Domain-specific knowledge**: Use proprietary or specialized documents
- **Transparency**: Cite sources for generated content
- **Cost-effective**: Avoid expensive fine-tuning for new data

## RAG Architecture Overview
1. **Document Ingestion**: Load and process documents
2. **Chunking**: Split documents into manageable pieces
3. **Embedding**: Convert text chunks to vector embeddings
4. **Vector Store**: Store embeddings in a searchable database
5. **Retrieval**: Find relevant chunks for a query
6. **Generation**: Use retrieved context to generate answers

## Prerequisites
- Python 3.8+ installed
- Basic understanding of machine learning concepts
- Familiarity with APIs and REST endpoints

## Setup

\`\`\`bash
cd courses/building-rags-starter
npm install
npm run dev
\`\`\`

## Next
Proceed to Module 1 to learn about document processing and chunking strategies.`,
    'document-processing': `# Module 1 — Document Processing & Chunking

Duration: 2 hours

## Objective
Learn how to process documents, extract text, and split them into optimal chunks for RAG systems.

## Learning outcomes
- Extract text from various document formats (PDF, DOCX, HTML, etc.)
- Implement effective chunking strategies
- Understand chunk size and overlap considerations
- Handle special content (code, tables, images)

## Document Formats
RAG systems need to handle multiple document types:
- **PDF**: Use libraries like \`pdfjs-dist\` or \`PyPDF2\`
- **DOCX**: Use \`mammoth\` or \`python-docx\`
- **HTML/Markdown**: Parse with standard libraries
- **Plain Text**: Direct processing

## Chunking Strategies

### Fixed-size Chunking
Simple approach: split text into fixed-size chunks.

\`\`\`python
def chunk_text(text, chunk_size=1000, overlap=200):
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunks.append(text[i:i + chunk_size])
    return chunks
\`\`\`

### Semantic Chunking
Split based on semantic boundaries (sentences, paragraphs).

### Recursive Chunking
Hierarchical approach: split by paragraphs, then sentences, then words.

## Best Practices
- **Chunk Size**: 500-1000 tokens typically work well
- **Overlap**: 10-20% overlap helps maintain context
- **Metadata**: Preserve document source, page numbers, timestamps
- **Special Content**: Handle code blocks, tables, and images separately

## Exercise 1.1 — Process a PDF Document
1. Load a sample PDF document
2. Extract all text content
3. Split into chunks of 800 tokens with 100 token overlap
4. Store chunks with metadata (source, chunk_id, page_number)

## Next
We'll cover vector embeddings and how to convert text chunks into searchable vectors.`,
    'vector-embeddings': `# Module 2 — Vector Embeddings

Duration: 2.5 hours

## Objective
Understand how to convert text into vector embeddings and choose the right embedding model for your RAG system.

## Learning outcomes
- Understand what vector embeddings are
- Choose appropriate embedding models
- Generate embeddings for your documents
- Optimize embedding quality and performance

## What are Embeddings?
Vector embeddings are numerical representations of text that capture semantic meaning. Similar texts have similar vectors.

## Embedding Models

### OpenAI Embeddings
- **Model**: \`text-embedding-ada-002\` or \`text-embedding-3-small\`
- **Dimensions**: 1536 or 512
- **Cost**: Pay per token
- **Quality**: Excellent for general use

### Open Source Alternatives
- **Sentence Transformers**: Free, runs locally
- **BGE Models**: High quality, multilingual
- **E5 Models**: Good for retrieval tasks

## Generating Embeddings

\`\`\`python
from openai import OpenAI

client = OpenAI()
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="Your text chunk here"
)
embedding = response.data[0].embedding
\`\`\`

## Embedding Best Practices
- **Batch Processing**: Process multiple chunks at once for efficiency
- **Caching**: Store embeddings to avoid recomputation
- **Normalization**: Normalize vectors for cosine similarity
- **Dimension Selection**: Balance quality vs. storage costs

## Exercise 2.1 — Generate Embeddings
1. Choose an embedding model
2. Generate embeddings for all document chunks
3. Store embeddings with their corresponding text chunks
4. Verify embedding quality with similarity tests

## Next
We'll set up a vector database to store and search these embeddings efficiently.`,
    'vector-databases': `# Module 3 — Vector Databases

Duration: 2 hours

## Objective
Learn how to store embeddings in vector databases and perform efficient similarity searches.

## Learning outcomes
- Choose the right vector database for your needs
- Store and index embeddings
- Perform similarity searches
- Optimize retrieval performance

## Vector Database Options

### Pinecone
- **Type**: Managed cloud service
- **Pros**: Easy setup, scalable, good performance
- **Cons**: Costs money, vendor lock-in
- **Best for**: Production applications

### Weaviate
- **Type**: Self-hosted or cloud
- **Pros**: Open source, flexible schema
- **Cons**: Requires infrastructure
- **Best for**: Custom requirements

### Chroma
- **Type**: Lightweight, embedded
- **Pros**: Easy to use, good for development
- **Cons**: Limited scalability
- **Best for**: Prototyping and small projects

### Qdrant
- **Type**: Self-hosted or cloud
- **Pros**: Fast, open source
- **Cons**: Setup complexity
- **Best for**: Performance-critical applications

## Setting Up Chroma (Example)

\`\`\`python
import chromadb

client = chromadb.Client()
collection = client.create_collection("documents")

# Add documents
collection.add(
    embeddings=embeddings,
    documents=text_chunks,
    ids=[f"chunk_{i}" for i in range(len(text_chunks))]
)

# Search
results = collection.query(
    query_embeddings=[query_embedding],
    n_results=5
)
\`\`\`

## Retrieval Strategies
- **Top-K Retrieval**: Return top K most similar chunks
- **Score Thresholding**: Only return chunks above similarity threshold
- **Hybrid Search**: Combine semantic and keyword search
- **Reranking**: Use a second model to rerank results

## Exercise 3.1 — Set Up Vector Database
1. Choose and set up a vector database
2. Store all document embeddings
3. Implement a retrieval function
4. Test retrieval quality with sample queries

## Next
We'll integrate retrieval with LLM generation to build a complete RAG system.`,
    'rag-implementation': `# Module 4 — Complete RAG Implementation

Duration: 3 hours

## Objective
Build a complete RAG system that retrieves relevant context and generates accurate, cited responses.

## Learning outcomes
- Integrate retrieval with LLM generation
- Implement prompt engineering for RAG
- Handle context window limitations
- Build a production-ready RAG pipeline

## RAG Pipeline

1. **User Query**: Receive user question
2. **Query Embedding**: Convert query to embedding
3. **Retrieval**: Find relevant document chunks
4. **Context Assembly**: Combine chunks into context
5. **Prompt Construction**: Build prompt with context
6. **Generation**: Call LLM with prompt
7. **Response**: Return answer with citations

## Prompt Engineering for RAG

\`\`\`python
prompt = f"""Use the following context to answer the question.
If you don't know the answer based on the context, say so.

Context:
{retrieved_context}

Question: {user_query}

Answer:"""
\`\`\`

## Context Management
- **Token Limits**: Respect model context windows
- **Chunk Selection**: Choose most relevant chunks
- **Context Ordering**: Order chunks by relevance
- **Truncation**: Handle cases where context is too long

## Citation and Sources
Always cite sources in your responses:

\`\`\`python
response = f"{answer}\\n\\nSources:\\n"
for chunk in retrieved_chunks:
    response += f"- {chunk['source']} (page {chunk['page']})\\n"
\`\`\`

## Exercise 4.1 — Build Complete RAG System
1. Implement the full RAG pipeline
2. Add citation support
3. Handle edge cases (no results, too much context)
4. Test with various queries
5. Measure accuracy and response quality

## Next
We'll optimize performance and deploy your RAG system to production.`,
    'optimization-deployment': `# Module 5 — Optimization & Deployment

Duration: 2.5 hours

## Objective
Optimize your RAG system for performance and deploy it to production.

## Learning outcomes
- Optimize retrieval and generation performance
- Implement caching strategies
- Set up monitoring and evaluation
- Deploy to production environments

## Performance Optimization

### Retrieval Optimization
- **Index Tuning**: Optimize vector index parameters
- **Hybrid Search**: Combine semantic and keyword search
- **Reranking**: Use cross-encoders for better results
- **Caching**: Cache frequent queries

### Generation Optimization
- **Model Selection**: Choose appropriate model size
- **Streaming**: Stream responses for better UX
- **Batch Processing**: Process multiple queries together
- **Token Management**: Optimize prompt length

## Evaluation Metrics
- **Retrieval Accuracy**: Are we getting relevant chunks?
- **Answer Quality**: Are answers accurate and helpful?
- **Response Time**: How fast is the system?
- **Cost**: What's the cost per query?

## Monitoring
- **Query Logging**: Log all queries and responses
- **Error Tracking**: Monitor failures and errors
- **Performance Metrics**: Track latency and throughput
- **User Feedback**: Collect user satisfaction scores

## Deployment Options

### Serverless (Vercel, Netlify Functions)
- Good for: Low to medium traffic
- Pros: Easy deployment, auto-scaling
- Cons: Cold starts, execution limits

### Container (Docker, Kubernetes)
- Good for: Production workloads
- Pros: Full control, scalable
- Cons: Infrastructure management

### Managed Services (AWS Bedrock, Azure AI)
- Good for: Enterprise applications
- Pros: Managed infrastructure
- Cons: Vendor lock-in, costs

## Exercise 5.1 — Deploy RAG System
1. Optimize your RAG pipeline
2. Set up monitoring and logging
3. Deploy to a production environment
4. Test with real users
5. Iterate based on feedback

## Congratulations!
You've built a complete RAG system. Continue learning with advanced topics like multi-query retrieval, query expansion, and fine-tuning retrieval models.`
  };

  // Load lesson content
  useEffect(() => {
    setLoading(true);
    
    const loadedLessons: Lesson[] = [
      {
        id: 'introduction',
        title: 'Introduction to RAG Systems',
        content: lessonContent['introduction'],
        duration: '1 hour',
        completed: false
      },
      {
        id: 'document-processing',
        title: 'Document Processing & Chunking',
        content: lessonContent['document-processing'],
        duration: '2 hours',
        completed: false
      },
      {
        id: 'vector-embeddings',
        title: 'Vector Embeddings',
        content: lessonContent['vector-embeddings'],
        duration: '2.5 hours',
        completed: false
      },
      {
        id: 'vector-databases',
        title: 'Vector Databases',
        content: lessonContent['vector-databases'],
        duration: '2 hours',
        completed: false
      },
      {
        id: 'rag-implementation',
        title: 'Complete RAG Implementation',
        content: lessonContent['rag-implementation'],
        duration: '3 hours',
        completed: false
      },
      {
        id: 'optimization-deployment',
        title: 'Optimization & Deployment',
        content: lessonContent['optimization-deployment'],
        duration: '2.5 hours',
        completed: false
      }
    ];

    setLessons(loadedLessons);

    // Set current lesson from URL or default to first
    if (lessonId) {
      const lessonExists = loadedLessons.find(l => l.id === lessonId);
      if (lessonExists) {
        setCurrentLessonId(lessonId);
      } else {
        setCurrentLessonId(loadedLessons[0]?.id || '');
      }
    } else {
      setCurrentLessonId(loadedLessons[0]?.id || '');
    }
    
    setLoading(false);
  }, [lessonId]);

  const handleLessonChange = (id: string) => {
    setCurrentLessonId(id);
    navigate(`/courses/building-rags/${id}`, { replace: true });
  };

  const handleComplete = (id: string) => {
    setLessons(prev => prev.map(lesson =>
      lesson.id === id ? { ...lesson, completed: true } : lesson
    ));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'lessons', label: 'Lessons', icon: <Play className="w-4 h-4" /> }
  ];

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (loading) {
    return (
      <CoursePageLayout
        title="Building RAGs"
        description="Loading…"
        completedCount={0}
        totalLessons={0}
        progress={0}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as 'lessons' | 'overview')}
        loading
      >
        {null}
      </CoursePageLayout>
    );
  }

  return (
    <CoursePageLayout
      title={course?.name || 'Building RAGs (Retrieval-Augmented Generation)'}
      description={course?.description || ''}
      duration={course?.duration}
      level={course?.level}
      completedCount={completedCount}
      totalLessons={lessons.length}
      progress={progress}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as 'lessons' | 'overview')}
      backTo="/learn"
    >
      <CourseOverviewSections
        course={course}
        lessons={lessons}
        activeTab={activeTab}
        currentLessonId={currentLessonId}
        onSelectLesson={handleLessonChange}
        onGoToLessons={() => setActiveTab('lessons')}
        onLessonChange={handleLessonChange}
        onComplete={handleComplete}
      />
    </CoursePageLayout>
  );
};

export default BuildingRagsCoursePage;
