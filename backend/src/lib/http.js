export const corsHeaders = () => ({
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
	"Access-Control-Allow-Credentials": "true"
});

export const json = (statusCode, body) => ({
	statusCode,
	headers: corsHeaders(),
	body: JSON.stringify(body)
});


