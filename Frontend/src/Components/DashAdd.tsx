import { useState, FormEvent } from "react";
import axios from "axios";
import { Button } from "./UI/Button";
import { InputBox } from "./UI/InputBox";
import { useToast } from "./UI/ToastProvider";

const WORD_LIMIT = 100;

export const DashAdd = () => {
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);

   const {addToast} = useToast();

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDescription(text);
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("tokenBB");
    const currentUsername = localStorage.getItem("usernameBB");

    if (!token || !currentUsername) {
      addToast({ type: "error", message: "You are not logged in." , size: "md"});
      setLoading(false);
      return;
    }

    try {
      const { data, status } = await axios.post(
        "https://api.brainbank.cv/v1/org/join/invites/send", 
        {
          receiverEmail: email,
          description: description,
          username: currentUsername, 
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (status === 200) {
        addToast({ type: "success", message: data.message,  size: "md" });
        setEmail("");
        setDescription("");
        setWordCount(0);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "An unexpected error occurred.";
      addToast({ type: "failure", message: errorMsg , size: "md" });
    } finally {
      setLoading(false);
    }
  };
  
  const isOverLimit = wordCount > WORD_LIMIT;

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6 justify-center items-center">
        <h2 className="text-xl md:text-2xl font-semibold dark:text-white">Invite a New Member</h2>
        
        <InputBox
          variant="atDashboard"
          placeholder="Recipient's email address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <div className="w-60 md:w-full">
          <textarea
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a short description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            rows={4}
            required
          />
          <p className={`text-sm text-right pr-2  ${isOverLimit ? 'text-red-500 font-bold' : 'text-gray-700 dark:text-gray-400'}`}>
            {wordCount}/{WORD_LIMIT} words
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          text={loading ? "Sending..." : "Send Join Request"}
          type="submit"
          disabled={loading || isOverLimit}
        />
      </form>
    </div>
  );
};
