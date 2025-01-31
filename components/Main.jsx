export default function Main() {
  return (
    <main>
      <form className="ingredient__form">
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          className="ingredient__input"
        />
        <button className="ingredient__button">Add ingredient</button>
      </form>
    </main>
  );
}
