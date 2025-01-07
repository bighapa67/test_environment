# AI Interaction Archive Template

## How to Use This Template
Present this template to the AI assistant when you want to create an archive of your interaction. Use the following prompt:

```
Please create an interaction archive following the template in docs/interaction_archive_template.md. 
Focus on preserving both technical solutions and interaction patterns that proved effective.
The archive should be optimized for future context activation while remaining concise and well-structured.
```

## Front Matter Guidelines
The front matter section is critical for future searchability across hundreds of archives. Structure it to enable efficient filtering and pattern matching:

```yaml
---
# Core identifiers for quick filtering
significance: []          # Use 🌟(breakthrough), 🔗(connected), 🧩(insight), etc.
intensity: 1-5           # Impact rating

# Technical footprint
technologies: []         # Specific tools, frameworks, languages used
patterns: []            # Technical patterns encountered/applied
problem_types: []       # Categories of challenges addressed

# Solution characteristics
primary_pattern: ""     # The main pattern that emerged
challenge_type: ""      # Nature of the challenge (e.g., "seemingly-simple-but-architecturally-complex")
solution_type: ""       # Nature of the solution (e.g., "architectural-rather-than-superficial")

# Knowledge connections
related_concepts:       # Connect problem/solution to broader domains
  - domain: ""         # Area of software engineering
    aspect: ""         # Specific aspect within that domain

# For pattern matching
keywords: []           # Specific technical terms for search matching
---
```

When creating front matter:
1. Think in terms of future searchability
2. Include both specific technologies and general patterns
3. Highlight surprising aspects of the problem/solution
4. Connect to broader engineering concepts
5. Use precise technical terms in keywords
6. Consider how someone might search for this solution
7. Include terms for both the problem space and solution space

## Archive Structure

### 1. Session Metadata
- Date and Context
- Primary Goals/Challenges
- Tools and Environment Used
- Key Technologies/Components Involved

### 2. Technical Implementation
- Final Working Code State
- Critical Dependencies
- Configuration Details
- Key Technical Decisions

### 3. Solution Evolution
- Initial Approach
- Key Pivot Points
- Failed Attempts and Learnings
- Successful Patterns Discovered

### 4. Investigation Methods
- Research Patterns That Worked
- Tools/Commands Used Effectively
- Documentation Sources Consulted
- Debugging Approaches

### 5. Interaction Patterns
- Communication Style That Worked
- Problem-Solving Approach
- Collaboration Points
- Knowledge-Sharing Methods

### 6. Key Insights
- Technical Discoveries
- Best Practices Identified
- Pitfalls to Avoid
- Reusable Patterns

### 7. Future Considerations
- Next Steps
- Potential Improvements
- Open Questions
- Related Areas to Explore

### 8. Quick Reference
- Essential Commands
- Critical Code Snippets
- Important File Paths
- Key Configuration Settings

## Notes for Archive Creation
1. Prioritize insights that would be valuable for future context
2. Include both successful and failed approaches when they provide learning value
3. Document not just what worked, but why it worked
4. Preserve interaction patterns that led to effective collaboration
5. Keep code snippets focused and well-commented
6. Include relevant links to documentation or resources
7. Structure information for quick comprehension
8. Balance completeness with conciseness

## Example Section (Optional)
Include a brief example of how each section should be filled out, demonstrating the desired level of detail and format. 

## Session Narrative
Include a technical story of the collaboration that:
- Describes the main challenges and their surprising aspects
- Details the journey through failed approaches to solutions
- Highlights key realizations and breakthrough moments
- Explains complex technical concepts in accessible language
- Connects specific technical details to broader engineering principles
- Emphasizes the learning value of the failed attempts
- Concludes with key takeaways about component architecture, type systems, or other relevant domains

The narrative should read like a technical case study, balancing storytelling with technical precision. Focus on:
1. What made the problem more complex than it initially appeared
2. How each failed attempt provided clues toward the solution
3. What the final solution reveals about the underlying technology
4. What broader engineering lessons were learned 