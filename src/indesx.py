import tkinter as tk

class IronManFlyingApp:
    def __init__(self, master):
        self.master = master
        self.master.title("Iron Man Flying Simulator")

        self.canvas = tk.Canvas(master, width=600, height=400, bg="sky blue")
        self.canvas.pack()

        self.iron_man = self.canvas.create_rectangle(50, 50, 100, 100, fill="red")

        self.move_left_button = tk.Button(master, text="Left", command=self.move_left)
        self.move_left_button.pack(side=tk.LEFT)

        self.move_right_button = tk.Button(master, text="Right", command=self.move_right)
        self.move_right_button.pack(side=tk.RIGHT)

        self.move_up_button = tk.Button(master, text="Up", command=self.move_up)
        self.move_up_button.pack(side=tk.TOP)

        self.move_down_button = tk.Button(master, text="Down", command=self.move_down)
        self.move_down_button.pack(side=tk.BOTTOM)

    def move_left(self):
        self.canvas.move(self.iron_man, -10, 0)

    def move_right(self):
        self.canvas.move(self.iron_man, 10, 0)

    def move_up(self):
        self.canvas.move(self.iron_man, 0, -10)

    def move_down(self):
        self.canvas.move(self.iron_man, 0, 10)

def main():
    root = tk.Tk()
    app = IronManFlyingApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
