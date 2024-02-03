import { defineComponent, ref } from "vue";
import Draggable from "vuedraggable"; // 确保已安装和导入了这个组件
interface Person {
  id: number;
  name: string;
}

interface IParams {
    [key: string | symbol]: any;
}

export const TestDraggable = defineComponent({
  name: "TestDraggable",
  props: {},
  emits: {},

  setup() {
    const groups = ref<IParams[]> ([
        { id: 1, name: "Person 1" , child: [{id: 1, name: "Person 5"}, {id: 1, name: "Person 6"}, {id: 1, name: "Person 7"}]},
        { id: 2, name: "Person 2" },
        { id: 3, name: "Person 3" },
        // ... other items
      ]);

    const drag = ref(false);
    const getGroupTitle = (group: any) => {
        // Your getGroupTitle logic here
        return group.name;
      };
    const dragEnd = (event: any) => {
        // Your dragEnd logic here
        console.log('groups', groups);
    };
  
    const renderContentItem = (item: IParams) => {
        const childItems = item.child?.map((child: any) => renderContentItem(child));
        
        const draggableOptions = {
            group: "grouplist",
            itemKey: "id",
          };
        return (
          <div class="sheet-group group-line">
            <div>{item.name}</div>
            {childItems && <Draggable style={'margin-left: 20px'} v-model={item.child} {...draggableOptions}>
                {{
                    item: (childProps: { element: IParams }) => (
                    <div class="draggable-item">
                        {childProps.element.name}
                    </div>
                    ),
                }}
            </Draggable>}
          </div>
        );
      };
  
      const renderContent = () => {
        const items = groups.value || [];
        return items.map((item: any) => {
          return renderContentItem(item);
        });
      };

    return {
        groups,
      drag,
      dragEnd,
      getGroupTitle,
      renderContent,
      renderContentItem,
    };
  },

  render() {
    
    return (
        <div>
            <Draggable list={this.groups}
            {...{
                onEnd:this.dragEnd,
                group:"grouplist"
            }}>
            {{
                item: (props: { element: any }) => {
                    return this.renderContentItem(props.element);
                },
                }}
            </Draggable>
        </div>
    );
  },
});
