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

const AIAgentsCoursePage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lessons' | 'overview'>('lessons');

  const course = courses.find(c => c.name === 'AI Agents Mastery');

  // Lesson content embedded
  const lessonContent = {
    'introduction': `# Introduction to AI Agents

Duration: 1.5 hours

## Objective
Understand what AI agents are, how they differ from simple chatbots, and the fundamental architecture of autonomous AI systems.

## Learning outcomes
- Understand the concept of AI agents and autonomous systems
- Learn the difference between agents, chatbots, and traditional AI
- Identify key components of agent architecture
- Set up your development environment

## What are AI Agents?
AI agents are autonomous systems that can:
- **Perceive** their environment through inputs
- **Reason** about tasks and make decisions
- **Act** by using tools and APIs
- **Learn** from feedback and adapt behavior

## Agent vs. Chatbot
- **Chatbot**: Responds to user messages, limited context
- **Agent**: Can perform multi-step tasks, use tools, make decisions
- **Agent**: Can work autonomously toward goals
- **Agent**: Can handle complex, multi-turn workflows

## Agent Architecture

### Core Components
1. **LLM Core**: Language model for reasoning
2. **Memory System**: Short-term and long-term memory
3. **Tool Interface**: Access to external tools and APIs
4. **Planning Module**: Break down complex tasks
5. **Execution Engine**: Execute actions and monitor results

## Types of Agents

### Single-Agent Systems
- One agent handles all tasks
- Simpler architecture
- Good for focused applications

### Multi-Agent Systems
- Multiple specialized agents
- Agents can collaborate
- Better for complex domains

### Hierarchical Agents
- Manager agents coordinate worker agents
- Clear task delegation
- Scalable architecture

## Prerequisites
- Python 3.8+ or Node.js 16+
- Understanding of LLMs and APIs
- Familiarity with async programming
- Basic knowledge of REST APIs

## Setup

\`\`\`bash
cd courses/ai-agents-starter
npm install
npm run dev
\`\`\`

## Next
Proceed to Module 1 to learn about tool integration and function calling.`,
    'tool-integration': `# Module 1 — Tool Integration & Function Calling

Duration: 2.5 hours

## Objective
Learn how to give AI agents the ability to use external tools, APIs, and functions to perform real-world tasks.

## Learning outcomes
- Implement function calling with LLMs
- Create tool interfaces for agents
- Handle tool execution and error handling
- Build a basic tool-enabled agent

## Function Calling
Modern LLMs support function calling, allowing them to:
- Request specific tools based on user needs
- Provide structured parameters
- Handle tool responses and continue conversation

## OpenAI Function Calling Example

\`\`\`python
from openai import OpenAI

client = OpenAI()

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location"]
        }
    }
}]

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "What's the weather in Paris?"}],
    tools=tools
)
\`\`\`

## Tool Categories

### Information Tools
- Web search
- Database queries
- Knowledge base lookups

### Action Tools
- API calls
- File operations
- System commands

### Analysis Tools
- Data processing
- Calculations
- Code execution

## Tool Execution Pattern

1. **Agent receives request**
2. **Agent decides which tool(s) to use**
3. **Agent calls tool with parameters**
4. **Tool executes and returns result**
5. **Agent processes result and responds**

## Error Handling
- Validate tool parameters
- Handle tool failures gracefully
- Retry with backoff strategies
- Provide meaningful error messages

## Exercise 1.1 — Build a Tool-Enabled Agent
1. Create a simple agent with 3 tools (calculator, web search, file read)
2. Implement function calling interface
3. Handle tool execution and responses
4. Test with various user queries

## Next
We'll cover planning and task decomposition for complex multi-step tasks.`,
    'planning-decomposition': `# Module 2 — Planning & Task Decomposition

Duration: 3 hours

## Objective
Learn how agents break down complex tasks into manageable steps and create execution plans.

## Learning outcomes
- Implement planning algorithms for agents
- Break down complex tasks into sub-tasks
- Create and manage execution plans
- Handle plan adjustments and replanning

## Why Planning Matters
Complex tasks require:
- Breaking down into smaller steps
- Sequencing actions correctly
- Handling dependencies
- Adapting when things go wrong

## Planning Approaches

### Linear Planning
Simple sequential execution:
1. Step 1
2. Step 2
3. Step 3

### Hierarchical Planning
Break tasks into subtasks:
- Main Task
  - Subtask A
    - Action 1
    - Action 2
  - Subtask B
    - Action 3

### Dynamic Planning
Plan as you go, adapt to results

## Planning with LLMs

### Prompt-Based Planning
Use LLM to generate plan:

\`\`\`python
plan_prompt = f"""
Break down this task into steps:
Task: {user_request}

Steps:
1.
2.
3.
"""
\`\`\`

### Structured Planning
Use frameworks like ReAct (Reasoning + Acting):

\`\`\`python
# ReAct Pattern
thought = "I need to search for information"
action = "search"
action_input = "query"
observation = execute_action(action, action_input)
thought = "Based on the results, I should..."
\`\`\`

## Task Decomposition Strategies

### By Function
Break by what needs to be done:
- Research
- Analysis
- Generation
- Validation

### By Domain
Break by knowledge area:
- Technical research
- Business analysis
- Creative generation

### By Time
Break by execution order:
- Prerequisites first
- Parallel tasks
- Final assembly

## Plan Execution

\`\`\`python
class Agent:
    def execute_plan(self, plan):
        for step in plan:
            result = self.execute_step(step)
            if not result.success:
                # Replan if step fails
                plan = self.replan(plan, step, result)
            self.update_memory(step, result)
        return self.get_final_result()
\`\`\`

## Exercise 2.1 — Build a Planning Agent
1. Create an agent that can break down complex tasks
2. Implement a simple planning algorithm
3. Execute plans step by step
4. Handle failures and replanning

## Next
We'll explore memory systems to help agents remember context and learn from experience.`,
    'memory-systems': `# Module 3 — Memory Systems

Duration: 2.5 hours

## Objective
Implement memory systems that allow agents to remember context, learn from interactions, and maintain state across sessions.

## Learning outcomes
- Design short-term and long-term memory
- Implement context management
- Store and retrieve agent memories
- Build memory-augmented agents

## Types of Memory

### Short-Term Memory
- Current conversation context
- Recent actions and results
- Working memory for current task

### Long-Term Memory
- Past conversations
- Learned patterns
- User preferences
- Domain knowledge

### Episodic Memory
- Specific events and experiences
- "I did X and got Y result"

### Semantic Memory
- General knowledge and facts
- "Users prefer X over Y"

## Memory Architecture

\`\`\`python
class AgentMemory:
    def __init__(self):
        self.short_term = []  # Recent context
        self.long_term = {}   # Persistent storage
        self.episodic = []    # Event history
    
    def add_to_context(self, message):
        self.short_term.append(message)
        # Keep only recent N messages
        if len(self.short_term) > 20:
            self.short_term.pop(0)
    
    def store_episode(self, episode):
        self.episodic.append(episode)
        # Extract learnings
        self.update_semantic_memory(episode)
\`\`\`

## Context Management
- **Token Limits**: Respect model context windows
- **Summarization**: Summarize old context when needed
- **Relevance**: Keep only relevant context
- **Compression**: Compress memories to save space

## Memory Storage Options

### In-Memory
- Fast access
- Lost on restart
- Good for development

### Database
- Persistent storage
- Query capabilities
- Good for production

### Vector Store
- Semantic search
- Similarity matching
- Good for knowledge retrieval

## Retrieval-Augmented Memory

\`\`\`python
def retrieve_relevant_memories(self, query):
    # Search episodic memory
    relevant_episodes = self.vector_store.search(query, top_k=5)
    
    # Search semantic memory
    relevant_facts = self.knowledge_base.search(query)
    
    return relevant_episodes + relevant_facts
\`\`\`

## Exercise 3.1 — Build Memory System
1. Implement short-term and long-term memory
2. Add memory retrieval based on relevance
3. Store and load agent memories
4. Test memory-augmented agent performance

## Next
We'll build multi-agent systems where agents collaborate to solve complex problems.`,
    'multi-agent-systems': `# Module 4 — Multi-Agent Systems

Duration: 3.5 hours

## Objective
Build systems with multiple agents that can collaborate, communicate, and coordinate to solve complex problems.

## Learning outcomes
- Design multi-agent architectures
- Implement agent communication protocols
- Coordinate agent actions
- Handle conflicts and consensus

## Why Multi-Agent Systems?
- **Specialization**: Each agent excels at specific tasks
- **Parallelism**: Multiple agents work simultaneously
- **Scalability**: Add agents as needed
- **Robustness**: System continues if one agent fails

## Multi-Agent Architectures

### Hierarchical
- Manager agent coordinates workers
- Clear command structure
- Good for structured tasks

### Peer-to-Peer
- Agents communicate directly
- No central authority
- Good for collaborative tasks

### Market-Based
- Agents bid on tasks
- Self-organizing
- Good for dynamic workloads

## Agent Communication

### Message Passing
\`\`\`python
class Agent:
    def send_message(self, recipient, message):
        recipient.receive_message(self.id, message)
    
    def receive_message(self, sender_id, message):
        # Process message
        self.process_message(sender_id, message)
\`\`\`

### Shared Memory
- Blackboard pattern
- Shared state
- Agents read/write to shared space

### Event Bus
- Publish-subscribe model
- Decoupled communication
- Scalable architecture

## Coordination Patterns

### Task Delegation
Manager assigns tasks to workers:
\`\`\`python
manager.delegate_task(worker_agent, task)
result = worker_agent.execute(task)
manager.collect_result(result)
\`\`\`

### Consensus Building
Agents vote on decisions:
\`\`\`python
votes = [agent.vote(proposal) for agent in agents]
decision = majority_consensus(votes)
\`\`\`

### Workflow Orchestration
Agents follow defined workflow:
1. Agent A completes task
2. Triggers Agent B
3. Agent B processes and triggers Agent C

## Conflict Resolution
- **Voting**: Majority decides
- **Authority**: Manager decides
- **Negotiation**: Agents negotiate solution
- **Priority**: Higher priority agent wins

## Exercise 4.1 — Build Multi-Agent System
1. Create 3 specialized agents (researcher, writer, reviewer)
2. Implement communication protocol
3. Coordinate agents to complete a complex task
4. Handle conflicts and failures

## Next
We'll cover deployment strategies and production best practices for AI agents.`,
    'deployment-production': `# Module 5 — Deployment & Production

Duration: 3 hours

## Objective
Deploy AI agents to production with proper monitoring, error handling, and scalability.

## Learning outcomes
- Deploy agents to production environments
- Implement monitoring and observability
- Handle errors and edge cases
- Scale agent systems
- Ensure safety and reliability

## Production Considerations

### Reliability
- Error handling and recovery
- Retry mechanisms
- Circuit breakers
- Health checks

### Performance
- Response time optimization
- Caching strategies
- Load balancing
- Resource management

### Security
- API key management
- Input validation
- Rate limiting
- Access control

### Observability
- Logging
- Metrics
- Tracing
- Alerting

## Deployment Patterns

### Serverless (AWS Lambda, Vercel)
- Auto-scaling
- Pay per use
- Cold start considerations
- Good for: Low to medium traffic

### Container (Docker, Kubernetes)
- Full control
- Scalable
- Infrastructure management
- Good for: Production workloads

### Managed Services (AWS Bedrock, Azure AI)
- Managed infrastructure
- Enterprise features
- Vendor lock-in
- Good for: Enterprise applications

## Monitoring

### Key Metrics
- **Latency**: Response time
- **Throughput**: Requests per second
- **Error Rate**: Failed requests
- **Cost**: API costs per request

### Logging
\`\`\`python
import logging

logger = logging.getLogger('agent')

logger.info('Agent started task', extra={
    'task_id': task_id,
    'user_id': user_id,
    'agent_type': 'researcher'
})
\`\`\`

### Tracing
Track agent execution:
- Tool calls
- LLM requests
- Memory operations
- External API calls

## Error Handling

### Retry Strategies
- Exponential backoff
- Maximum retries
- Circuit breakers

### Fallback Mechanisms
- Default responses
- Simplified agent mode
- Human handoff

### Validation
- Input validation
- Output validation
- Tool result validation

## Safety & Guardrails

### Content Filtering
- Toxic content detection
- PII detection
- Output validation

### Rate Limiting
- Per-user limits
- Per-IP limits
- Global rate limits

### Cost Controls
- Budget limits
- Token limits
- Request throttling

## Exercise 5.1 — Deploy Agent System
1. Set up production environment
2. Implement monitoring and logging
3. Add error handling and retries
4. Deploy and test
5. Monitor performance and costs

## Best Practices
- Start simple, iterate
- Monitor everything
- Plan for failures
- Test thoroughly
- Document well
- Keep costs in check

## Congratulations!
You've mastered building production-ready AI agents. Continue learning with advanced topics like agent fine-tuning, specialized architectures, and cutting-edge research.`
  };

  // Load lesson content
  useEffect(() => {
    setLoading(true);
    
    const loadedLessons: Lesson[] = [
      {
        id: 'introduction',
        title: 'Introduction to AI Agents',
        content: lessonContent['introduction'],
        duration: '1.5 hours',
        completed: false
      },
      {
        id: 'tool-integration',
        title: 'Tool Integration & Function Calling',
        content: lessonContent['tool-integration'],
        duration: '2.5 hours',
        completed: false
      },
      {
        id: 'planning-decomposition',
        title: 'Planning & Task Decomposition',
        content: lessonContent['planning-decomposition'],
        duration: '3 hours',
        completed: false
      },
      {
        id: 'memory-systems',
        title: 'Memory Systems',
        content: lessonContent['memory-systems'],
        duration: '2.5 hours',
        completed: false
      },
      {
        id: 'multi-agent-systems',
        title: 'Multi-Agent Systems',
        content: lessonContent['multi-agent-systems'],
        duration: '3.5 hours',
        completed: false
      },
      {
        id: 'deployment-production',
        title: 'Deployment & Production',
        content: lessonContent['deployment-production'],
        duration: '3 hours',
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
    navigate(`/courses/ai-agents/${id}`, { replace: true });
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
        title="AI Agents"
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
      title={course?.name || 'AI Agents Mastery'}
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

export default AIAgentsCoursePage;
