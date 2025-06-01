import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const GET_THREAD = gql`
  query GetThread($id: ID!) {
    annotation(id: $id) {
      id
      type
      coordinates
      label
      photo {
        id
        s3Url
        fileName
      }
      comments {
        id
        content
        createdAt
        user {
          id
          name
          department
        }
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($annotationId: ID!, $content: String!) {
    addComment(annotationId: $annotationId, content: $content) {
      id
      content
      createdAt
      user {
        id
        name
        department
      }
    }
  }
`;

export default function ThreadView() {
  const { threadId } = useParams<{ threadId: string }>();
  const [newComment, setNewComment] = useState('');
  
  const { loading, error, data } = useQuery(GET_THREAD, {
    variables: { id: threadId },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_THREAD, variables: { id: threadId } }],
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { annotation } = data;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({
        variables: {
          annotationId: threadId,
          content: newComment,
        },
      });
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Photo Preview */}
            <div className="mb-6">
              <img
                src={annotation.photo.s3Url}
                alt={annotation.photo.fileName}
                className="max-w-full h-auto rounded-lg"
              />
            </div>

            {/* Annotation Details */}
            <div className="mb-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Annotation Details
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>Type: {annotation.type}</p>
                {annotation.label && <p>Label: {annotation.label}</p>}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Comments
              </h3>
              <div className="mt-4 space-y-4">
                {annotation.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <ChatBubbleLeftIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          {comment.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-gray-700">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className="mt-6">
                <div>
                  <label htmlFor="comment" className="sr-only">
                    Add your comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Add your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
                <div className="mt-3">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 