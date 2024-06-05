const Users = require("./models/Users");

async function getUsers(req, res) {
    try {
        const userId = req.params.userId;
        const users = await Users.find({ _id: { $ne: userId } });
        const usersData = await Promise.all(
            users.map(async (user) => {
                return {
                    user: {
                        email: user.email,
                        fullName: user.fullName,
                        receiverId: user._id,
                    },
                };
            })
        );
        res.status(200).json(usersData);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

describe('getUsers', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                userId: 'userId',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return list of users except the specified user', async () => {
        const mockUsers = [
            { _id: 'user1', email: 'user1@example.com', fullName: 'User One' },
            { _id: 'user2', email: 'user2@example.com', fullName: 'User Two' },
        ];
        // Mock the find method of Users model
        Users.find = jest.fn().mockResolvedValue(mockUsers);

        await getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            { user: { email: 'user1@example.com', fullName: 'User One', receiverId: 'user1' } },
            { user: { email: 'user2@example.com', fullName: 'User Two', receiverId: 'user2' } },
        ]);
    });

    test('should handle error and return 500 status code', async () => {
        // Mock the find method of Users model to throw an error
        Users.find = jest.fn().mockRejectedValue(new Error('Test error'));

        await getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });
});
