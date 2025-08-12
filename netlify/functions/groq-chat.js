const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'mixtral-8x7b-32768',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: chatCompletion.choices[0]?.message?.content || '' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
