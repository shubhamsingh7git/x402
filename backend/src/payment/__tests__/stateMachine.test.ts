import { PaymentContext } from "../dto/paymentContext";
import { PaymentStateMachine } from "../state/paymentState.machine";

const testStateMachine = () => {
  console.log("🧪 Testing PaymentStateMachine transitions...");

  const context = new PaymentContext({
    merchantId: "OpenAI API",
    price: 0.01,
    runId: "run_test_123",
    stepId: 1,
  });

  const initialState: string = context.state;
  if (initialState !== "CREATED") {
    throw new Error(`Expected CREATED state, got ${context.state}`);
  }

  PaymentStateMachine.transition(context, "VALIDATING");
  const validatingState: string = context.state;
  if (validatingState !== "VALIDATING") {
    throw new Error(`Expected VALIDATING state, got ${context.state}`);
  }

  PaymentStateMachine.transition(context, "POLICY_CHECK");
  PaymentStateMachine.transition(context, "APPROVED");
  PaymentStateMachine.transition(context, "PREPARING");
  PaymentStateMachine.transition(context, "READY");
  PaymentStateMachine.transition(context, "PROCESSING");
  PaymentStateMachine.transition(context, "COMPLETED");

  const completedState: string = context.state;
  if (completedState !== "COMPLETED") {
    throw new Error(`Expected COMPLETED state, got ${context.state}`);
  }

  console.log("✅ PaymentStateMachine transitions test PASSED!");
};

testStateMachine();
