export default function RecipeHistory({ history }) {
  if (history.length === 0) return null;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📜 Recipe History</h3>

      {history.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <strong>Ingredients:</strong>
          <p>{item.ingredients}</p>

          <strong>Recipe:</strong>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {item.recipe}
          </pre>
        </div>
      ))}
    </div>
  );
}